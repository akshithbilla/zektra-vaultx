// server.js
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";
import AWS from 'aws-sdk';
import path from "path";
import { fileURLToPath } from "url";
import multer from 'multer';
import { uploadFile } from './controllers/uploadController.js';
import {File} from "./models/File.js"
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fromIni } from '@aws-sdk/credential-providers';
import { deleteFileFromS3 } from './s3Upload.js';
//import { GetObjectCommand } from '@aws-sdk/client-s3';
import encryptionRoutes from './routes/encryption.js';

const router = express.Router();
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import recaptchaRoute from './routes/recaptcha.js';


// Middleware ---------------------------------------------------------------------

app.use(cors({
 origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-decryption-password'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use("/api", recaptchaRoute);
// Mongoose Setup -----------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo connection error:", err));

app.use('/api/encryption', encryptionRoutes);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,
  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
  vaultKey: {
    encrypted: String,     // Hex string instead of Buffer
    salt: String,          // Hex string used in Argon2
    iv: String,            // AES IV (hex)
    tag: String            // AES GCM tag (hex)
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export { User };




// JWT Helpers -------------------------------------------------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  } else {
    res.status(401).json({ message: "Authorization header missing" });
  }
};

// Google OAuth Strategy ---------------------------------------------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.email });
    if (!user) {
      user = await User.create({ 
        email: profile.email, 
        password: "google", 
        isVerified: true 
      });
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

// Email Transport ---------------------------------------------------------------
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Add this validation check
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials are missing!');
  process.exit(1);
}


// Verify configuration is working
console.log('S3 configured for bucket:', process.env.AWS_BUCKET_NAME);
// Routes ------------------------------------------------------------------------

// Authentication Routes ---------------------------------------------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: username });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      email: username,
      password: hashedPassword,
      verificationToken,
    });

    const verifyLink = `${process.env.BACKEND_URL}/verify-email/${verificationToken}`;
    await transporter.sendMail({
      from: '"MyPortfolify" <myportfolify@gmail.com>',
      to: username,
      subject: "Complete Your MyPortfolify Registration",
      text: `Hi ${username.split('@')[0]}!\n\nWelcome to MyPortfolify! To get started, please verify your email address by clicking the link below:\n\n${verifyLink}\n\nThis link will expire in 24 hours. If you didn't request this, please ignore this email.\n\nThanks,\nThe MyPortfolify Team`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #2c3e50; font-size: 24px; margin: 0;">MyPortfolify</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">Welcome to MyPortfolify!</h2>
              <p style="line-height: 1.6;">Hi ${username.split('@')[0]},</p>
              <p style="line-height: 1.6;">Thank you for creating an account. Please verify your email address to complete your registration and start building your portfolio.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">Verify Email Address</a>
              </div>
              
              <p style="line-height: 1.6; font-size: 14px; color: #666;">This verification link will expire in 24 hours. If you didn't create a MyPortfolify account, you can safely ignore this email.</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777;">
              <p>© ${new Date().getFullYear()} MyPortfolify. All rights reserved.</p>
              <p style="margin-bottom: 0;">If you're having trouble with the button above, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all;">${verifyLink}</p>
            </div>
          </div>
        </div>
      `,
    });

    res.status(200).json({ message: "Registered, verify email sent", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { verificationToken: token },
      { isVerified: true, verificationToken: null },
      { new: true }
    );
    if (!user) return res.status(400).send("Invalid or expired token");
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ email: username });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first" });

    // Update login info
    await User.findByIdAndUpdate(user._id, { 
      $set: { lastLogin: new Date() },
      $inc: { loginCount: 1 }
    });

    const token = generateToken(user);
    res.status(200).json({ 
      message: "Logged in", 
      user: {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified
      },
      token 
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);
    // Redirect to login page with token as query
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 3600000;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: '"MyPortfolify Security" <security@myportfolify.com>',
      to: email,
      subject: "Password Reset Request for Your MyPortfolify Account",
      text: `Hi there,\n\nWe received a request to reset your MyPortfolify password. Click the link below to proceed:\n\n${resetLink}\n\nThis link expires in 1 hour for security reasons.\n\nIf you didn't request this, please ignore this email or contact support.\n\n- The MyPortfolify Team`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #2c3e50; margin: 0; font-size: 22px;">MyPortfolify</h1>
              <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Portfolio Management</p>
            </div>

            <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
              <p style="line-height: 1.6;">We received a request to reset the password for your account.</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${resetLink}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: white; 
                          text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 15px;
                          transition: background-color 0.3s ease;"
                   onMouseOver="this.style.backgroundColor='#4f46e5'" 
                   onMouseOut="this.style.backgroundColor='#6366f1'">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons. 
                If you didn't request a password reset, please secure your account by 
                <a href="mailto:support@myportfolify.com" style="color: #6366f1;">contacting support</a>.
              </p>
            </div>

            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p>© ${new Date().getFullYear()} MyPortfolify. All rights reserved.</p>
              <p style="margin: 5px 0;">For your security, do not share this email with anyone.</p>
              <p>If the button doesn't work, copy this URL to your browser:<br>
                <span style="word-break: break-all; color: #475569;">${resetLink}</span>
              </p>
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({ message: "Reset link sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

app.post("/resend-verification", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account found with that email" });

    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified" });

    // Create a new token and save, or reuse if you want
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verifyLink = `${process.env.BACKEND_URL}/verify-email/${verificationToken}`;
    await transporter.sendMail({
      from: '"MyPortfolify" <myportfolify@gmail.com>',
      to: email,
      subject: "Resend Email Verification for MyPortfolify",
      text: `Hi ${email.split('@')[0]}!\n\nYou requested a new verification email. Please verify your email address by clicking the link below:\n\n${verifyLink}\n\nIf you didn't request this, please ignore this email.\n\nThanks,\nThe MyPortfolify Team`,
      html: `
        <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #2c3e50; font-size: 24px; margin: 0;">MyPortfolify</h1>
            </div>
            <div style="background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
              <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0;">Verify Your Email Address</h2>
              <p style="line-height: 1.6;">Hi ${email.split('@')[0]},</p>
              <p style="line-height: 1.6;">Please verify your email address to activate your account.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 16px;">Verify Email Address</a>
              </div>
              <p style="line-height: 1.6; font-size: 14px; color: #666;">If you didn't create a MyPortfolify account, you can safely ignore this email.</p>
            </div>
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #777;">
              <p>© ${new Date().getFullYear()} MyPortfolify. All rights reserved.</p>
              <p style="margin-bottom: 0;">If you're having trouble with the button above, copy and paste this URL into your browser:</p>
              <p style="word-break: break-all;">${verifyLink}</p>
            </div>
          </div>
        </div>
      `,
    });

    res.json({ message: "Verification email sent" });
  } catch (e) {
    res.status(500).json({ message: "Failed to send verification email" });
  }
});
// Add caching to check-auth endpoint

app.get('/check-auth', (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false, error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ authenticated: false, error: 'Token missing' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ authenticated: true, user });
  } catch (err) {
    return res.status(401).json({ authenticated: false, error: 'Invalid or expired token' });
  }
});


 

// Profile Routes -----------------------------------------------------------------
app.get('/api/profiles/check-username', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const profile = await Project.findOne({ username });
    res.json({ exists: !!profile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//------------------------------------------------------------------------------------
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for AWS uploads
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add any file type restrictions here
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Upload Endpoint
app.post('/upload', 
  authenticateJWT,
  upload.single('file'),
  async (req, res) => {
    try {
      const fileExtension = req.file.originalname.split('.').pop();
      const s3Key = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

      await s3Client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }));

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

      const newFile = await File.create({
        _id: new mongoose.Types.ObjectId(),
        userId: req.user.id,
        name: req.file.originalname,
        s3Key,
        url: fileUrl,
        contentType: req.file.mimetype,
        size: req.file.size,
        storageType: req.body.storageType || 'docsafe',
        tags: req.body.tags ? req.body.tags.split(',') : []
      });

      res.json({ success: true, file: newFile });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Add a delete endpoint if needed
// app.delete('/files/:key', authenticateJWT, async (req, res) => {
//   try {
//     await deleteFileFromS3(req.params.key);
//     res.json({ success: true, message: 'File deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       message: 'File deletion failed',
//       error: error.message 
//     });
//   }
// });
// server.js

// Get all files for authenticated user
app.get('/api/files', authenticateJWT, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch files' });
  }
});

// Get files by storage type
app.get('/api/files/:storageType', authenticateJWT, async (req, res) => {
  try {
    const files = await File.find({ 
      userId: req.user.id,
      storageType: req.params.storageType 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch files' });
  }
});
// Add to server.js




// Get all files for authenticated user
app.get('/files', authenticateJWT, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    // Group files by storageType
    const groupedFiles = files.reduce((acc, file) => {
      const category = file.storageType;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(file);
      return acc;
    }, {});
    
    res.json({ success: true, data: groupedFiles });
  } catch (error) {
    console.error('Failed to fetch files:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch files' });
  }
});

// Update these endpoints in your server.js
// Add this right before your app.listen() call
// Update your test endpoint to use v2 syntax
// For v3
// OR const AWS = require('aws-sdk'); for v2

app.get('/test-file-preview', async (req, res) => {
  try {
    // Test configuration
    const testConfig = {
      bucket: process.env.AWS_BUCKET_NAME,
      key: '1751263301860-r2md4vlbpx.pdf', // Your test file
      expectedType: 'application/pdf'
    };

    // 1. Test S3 connection
    const s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    // 2. Test file access
    const { ContentLength, ContentType } = await s3.send(
      new GetObjectCommand({
        Bucket: testConfig.bucket,
        Key: testConfig.key
      })
    );

    // 3. Test response
    res.json({
      success: true,
      fileExists: true,
      fileSize: ContentLength,
      fileType: ContentType,
      config: testConfig
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: error.name, // 'NoSuchKey', 'AccessDenied', etc.
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      awsConfig: {
        bucket: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION
      }
    });
  }
});
// // Download file endpoint
// app.get('/files/download/:id', authenticateJWT, async (req, res) => {
//   try {
//     const file = await File.findOne({ 
//       _id: req.params.id,
//       userId: req.user.id 
//     });
    
//     if (!file) {
//       return res.status(404).json({ success: false, message: 'File not found' });
//     }

//     const command = new GetObjectCommand({
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: file.s3Key
//     });
    
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
//     res.redirect(url);
    
//   } catch (error) {
//     console.error('Download error:', error);
//     res.status(500).json({ success: false, message: 'Failed to download file' });
//   }
// });

// ... other routes ...

// DELETE by MongoDB file ID (the only one you need!)
// app.delete('/files/:id', authenticateJWT, async (req, res) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ success: false, message: 'Invalid file id' });
//     }
//     const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
//     if (!file) {
//       return res.status(404).json({ success: false, message: 'File not found' });
//     }
//     let s3DeleteSuccess = true;
//     try {
//       await deleteFileFromS3(file.s3Key);
//     } catch (s3err) {
//       s3DeleteSuccess = false;
//       console.error('S3 delete error:', s3err);
//     }
//     await File.deleteOne({ _id: req.params.id });
//     res.json({
//       success: true,
//       message: s3DeleteSuccess
//         ? 'File deleted successfully'
//         : 'File deleted from DB, but failed to delete from S3 (see server logs)'
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to delete file', error: error.message });
//   }
// });

// REMOVE THIS S3-key-only endpoint!
/*
app.delete('/files/:key', authenticateJWT, async (req, res) => {
  try {
    await deleteFileFromS3(req.params.key);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'File deletion failed',
      error: error.message 
    });
  }
});
*/
// Preview file endpoint

app.get('/files/preview/:id', authenticateJWT, async (req, res) => {
  try {
    // Validate file ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    const file = await File.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Generate signed URL with proper content type
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Key,
      ResponseContentType: file.contentType,
      ResponseContentDisposition: `inline; filename="${encodeURIComponent(file.name)}"`
    });

    // URL valid for 1 hour
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({
      success: true,
      url,
      name: file.name,
      type: file.contentType
    });

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ 
      error: 'Preview failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
//------------------------------------------------------------------------------------
 
// Create or get user profile
app.post('/api/profiles', authenticateJWT, async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if username is available
    const existingProfile = await Project.findOne({ username });
    if (existingProfile) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Create new profile with all fields


    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user's profile
app.get('/api/profiles/me', authenticateJWT, async (req, res) => {
  try {
    const profile = await Project.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update profile information
app.put('/api/profiles/me/profile', authenticateJWT, async (req, res) => {
  try {
    const { profile } = req.body;
    
    const updatedProfile = await Project.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { profile } },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});