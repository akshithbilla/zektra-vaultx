import mongoose from "mongoose";

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
    encrypted: Buffer, // Store as Buffer!
    salt: String,      // hex string
    iv: String         // hex string
  },
  keyDerivation: {
    iterations: { type: Number, default: 100000 },
    hash: { type: String, default: 'sha512' }
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export { User };