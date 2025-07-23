// ✅ routes/encryption.js
import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { s3Client } from '../config/s3Client.js';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { User } from '../index.js';
import { File } from '../models/File.js';
import {
  generateRandomKey,
  encryptData,
  decryptData,
  deriveKeyArgon2,
  toBufferIfNecessary
} from '../utils/cryptoUtils.js';

dotenv.config();
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// 🏁 Vault Initialization
router.post('/initialize-vault', authenticateJWT, async (req, res) => {
  const { decryptionPassword } = req.body;
  if (!decryptionPassword) return res.status(400).json({ message: 'Password required' });

  const user = await User.findById(req.user.id);
  if (user.vaultKey?.encrypted) return res.status(400).json({ message: 'Vault already initialized' });

  try {
    const vaultKey = generateRandomKey(32);
    const salt = generateRandomKey(16);
    const iv = generateRandomKey(12);

    const derivedKey = await deriveKeyArgon2(decryptionPassword, salt);
    const { encrypted, tag } = encryptData(vaultKey, derivedKey, iv);

    console.log('🔍 Vault initialization - encryption result:', {
      hasEncrypted: !!encrypted,
      hasTag: !!tag,
      encryptedLength: encrypted.length,
      tagLength: tag.length
    });

    user.vaultKey = {
      encrypted: encrypted.toString('hex'),
      salt: salt.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };

    await user.save();

    // Verify the save worked
    const savedUser = await User.findById(req.user.id);
    console.log('✅ Vault saved successfully:', {
      hasVaultKey: !!savedUser.vaultKey,
      vaultKeyKeys: savedUser.vaultKey ? Object.keys(savedUser.vaultKey) : [],
      hasTag: !!savedUser.vaultKey?.tag
    });

    res.json({ message: 'Vault initialized successfully' });
  } catch (err) {
    console.error('❌ Vault initialization error:', err);
    res.status(500).json({ message: 'Failed to initialize vault' });
  }
});

// 🔧 Vault Repair (for corrupted vaults)
router.post('/repair-vault', authenticateJWT, async (req, res) => {
  const { decryptionPassword } = req.body;
  if (!decryptionPassword) return res.status(400).json({ message: 'Password required' });

  const user = await User.findById(req.user.id);
  
  // Check if vault exists but is corrupted (missing tag or incomplete)
  if (user.vaultKey?.encrypted && !user.vaultKey.tag) {
    console.log('🔧 Repairing corrupted vault for user:', req.user.id);
    
    try {
      // Clear the corrupted vault key
      user.vaultKey = undefined;
      await user.save();
      
      // Re-initialize with proper structure
      const vaultKey = generateRandomKey(32);
      const salt = generateRandomKey(16);
      const iv = generateRandomKey(12);

      const derivedKey = await deriveKeyArgon2(decryptionPassword, salt);
      const { encrypted, tag } = encryptData(vaultKey, derivedKey, iv);

      user.vaultKey = {
        encrypted: encrypted.toString('hex'),
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
      };

      await user.save();
      
      console.log('✅ Vault repaired successfully');
      res.json({ message: 'Vault repaired successfully' });
    } catch (err) {
      console.error('❌ Vault repair failed:', err);
      res.status(500).json({ message: 'Failed to repair vault' });
    }
  } else {
    res.status(400).json({ message: 'Vault does not need repair or is not initialized' });
  }
});

// 🔐 Reset Decryption Password
// 🔐 Reset Decryption Password
router.post('/reset-decryption-password', authenticateJWT, async (req, res) => {
  const { accountPassword, newDecryptionPassword } = req.body;
  if (!accountPassword || !newDecryptionPassword) {
    return res.status(400).json({ message: 'Account password and new decryption password are required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify account password
    const isValidPassword = await bcrypt.compare(accountPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid account password' });
    }

    // Generate new vault key
    const newVaultKey = generateRandomKey(32);
    const newSalt = generateRandomKey(16);
    const newIv = generateRandomKey(12);
    const newDerivedKey = await deriveKeyArgon2(newDecryptionPassword, newSalt);
    const { encrypted: newEncryptedVaultKey, tag: newTag } = encryptData(newVaultKey, newDerivedKey, newIv);

    // Update user vault key
    user.vaultKey = {
      encrypted: newEncryptedVaultKey.toString('hex'),
      salt: newSalt.toString('hex'),
      iv: newIv.toString('hex'),
      tag: newTag.toString('hex'),
    };
    await user.save();

    // Update all encrypted files with new vault key and new file keys
    const files = await File.find({ userId: req.user.id });
    for (const file of files) {
      try {
        // Generate a new file key since we can't decrypt the old one without the original password
        const newFileKey = generateRandomKey(32);
        const newFileIv = generateRandomKey(12);
        const { encrypted: newEncryptedFileKey, tag: newKeyTag } = encryptData(newFileKey, newVaultKey, newFileIv);

        // Update file encryption details
        file.encryption.fileKey = newEncryptedFileKey.toString('hex');
        file.encryption.fileIv = newFileIv.toString('hex');
        file.encryption.keyTag = newKeyTag.toString('hex');
        await file.save();

        // Note: The actual file content in S3 remains encrypted with the old file key.
        // Users will need to re-upload files to encrypt them with the new file key.
      } catch (err) {
        console.error(`❌ Failed to update file ${file._id}:`, err);
        // Log error but continue with other files
      }
    }

    res.json({
      message: 'Decryption password reset successfully. Note: Existing files are inaccessible and need to be re-uploaded.'
    });
  } catch (err) {
    console.error('❌ Reset decryption password error:', err);
    res.status(500).json({ message: 'Failed to reset decryption password' });
  }
});

// 🔐 Upload Encrypted File
// 🔐 Upload Encrypted File - Updated for metadata encryption
router.post('/encrypt-upload', authenticateJWT, upload.single('file'), async (req, res) => {
  const { decryptionPassword, itemName, tags, storageType } = req.body;

  if (!decryptionPassword || !req.file) {
    return res.status(400).json({ 
      message: decryptionPassword ? 'No file uploaded' : 'Password required',
      code: decryptionPassword ? 'MISSING_FILE' : 'MISSING_PASSWORD'
    });
  }

  const user = await User.findById(req.user.id);
  
  if (!user.vaultKey) {
    return res.status(400).json({ 
      message: 'Vault not initialized',
      code: 'VAULT_NOT_INITIALIZED'
    });
  }

  try {
    // Get vault key
    const salt = toBufferIfNecessary(user.vaultKey.salt);
    const iv = toBufferIfNecessary(user.vaultKey.iv);
    const tag = toBufferIfNecessary(user.vaultKey.tag);
    const encryptedVaultKey = toBufferIfNecessary(user.vaultKey.encrypted);
    const derivedKey = await deriveKeyArgon2(decryptionPassword, salt);
    const vaultKey = decryptData(encryptedVaultKey, derivedKey, iv, tag);

    // Prepare and encrypt metadata
    const metadata = {
      name: itemName || req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      storageType: storageType || 'secure-vault',
      tags: tags?.split(',') || []
    };
    
    const metadataIv = generateRandomKey(12);
    const metadataString = JSON.stringify(metadata);
    const { encrypted: encryptedMetadata, tag: metadataTag } = encryptData(metadataString, vaultKey, metadataIv);

    // Encrypt file content
    const fileKey = generateRandomKey(32);
    const fileIv = generateRandomKey(12);
    const { encrypted: encryptedFile, tag: fileTag } = encryptData(req.file.buffer, fileKey, fileIv);
    const { encrypted: encryptedFileKey, tag: keyTag } = encryptData(fileKey, vaultKey, fileIv);

    // Upload to S3
    const fileExt = req.file.originalname.split('.').pop();
    const s3Key = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: encryptedFile,
      ContentType: 'application/octet-stream' // Generic type since it's encrypted
    }));

    // Save to database
    const file = await File.create({
      userId: req.user.id,
      s3Key,
      encryptedMetadata: {
        data: encryptedMetadata.toString('hex'),
        iv: metadataIv.toString('hex'),
        tag: metadataTag.toString('hex')
      },
      encryption: {
        fileKey: encryptedFileKey.toString('hex'),
        fileIv: fileIv.toString('hex'),
        fileTag: fileTag.toString('hex'),
        keyTag: keyTag.toString('hex')
      }
    });

    res.json({ message: 'File encrypted and uploaded', fileId: file._id });
  } catch (err) {
    console.error('❌ Encrypt upload error:', err);
    if (err.code === 'OSSL_EVP_BAD_DECRYPT' || err.message.includes('bad decrypt')) {
      return res.status(400).json({ 
        message: 'Invalid decryption password',
        code: 'WRONG_PASSWORD'
      });
    }
    res.status(500).json({ message: 'Internal server error during encryption' });
  }
});
// 📋 Get Vault Items
// 📋 Get Vault Items - Updated for metadata decryption
router.get('/vault-items', authenticateJWT, async (req, res) => {
  const { decryptionPassword } = req.query;
  if (!decryptionPassword) return res.status(400).json({ message: 'Password required' });

  try {
    const user = await User.findById(req.user.id);
    if (!user.vaultKey) return res.status(400).json({ message: 'Vault not initialized' });

    // Get vault key
    const salt = toBufferIfNecessary(user.vaultKey.salt);
    const iv = toBufferIfNecessary(user.vaultKey.iv);
    const tag = toBufferIfNecessary(user.vaultKey.tag);
    const encryptedVaultKey = toBufferIfNecessary(user.vaultKey.encrypted);
    const derivedKey = await deriveKeyArgon2(decryptionPassword, salt);
    const vaultKey = decryptData(encryptedVaultKey, derivedKey, iv, tag);

    const files = await File.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    const decryptedFiles = await Promise.all(files.map(async file => {
      try {
        // Decrypt metadata
        const metadataIv = toBufferIfNecessary(file.encryptedMetadata.iv);
        const metadataTag = toBufferIfNecessary(file.encryptedMetadata.tag);
        const encryptedMetadata = toBufferIfNecessary(file.encryptedMetadata.data);
        const decryptedMetadata = decryptData(encryptedMetadata, vaultKey, metadataIv, metadataTag);
        
        return {
          id: file._id,
          s3Key: file.s3Key,
          createdAt: file.createdAt,
          ...JSON.parse(decryptedMetadata)
        };
      } catch (err) {
        console.error(`Failed to decrypt metadata for file ${file._id}:`, err);
        return {
          id: file._id,
          s3Key: file.s3Key,
          createdAt: file.createdAt,
          name: '🔒 [Encrypted File]',
          error: 'Failed to decrypt metadata'
        };
      }
    }));

    res.json({ files: decryptedFiles });
  } catch (err) {
    console.error('❌ List vault items error:', err);
    if (err.code === 'OSSL_EVP_BAD_DECRYPT' || err.message.includes('bad decrypt')) {
      return res.status(400).json({ 
        message: 'Invalid decryption password',
        code: 'WRONG_PASSWORD'
      });
    }
    res.status(500).json({ message: 'Failed to list vault items' });
  }
});

// 🔓 Download Decrypted File
// 🔓 Download Decrypted File - Updated for metadata decryption
router.get('/decrypt-download/:id', authenticateJWT, async (req, res) => {
  const { decryptionPassword } = req.query;
  if (!decryptionPassword) return res.status(400).json({ message: 'Password required' });

  try {
    const user = await User.findById(req.user.id);
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Get vault key
    const salt = toBufferIfNecessary(user.vaultKey.salt);
    const iv = toBufferIfNecessary(user.vaultKey.iv);
    const tag = toBufferIfNecessary(user.vaultKey.tag);
    const encryptedVaultKey = toBufferIfNecessary(user.vaultKey.encrypted);
    const derivedKey = await deriveKeyArgon2(decryptionPassword, salt);
    const vaultKey = decryptData(encryptedVaultKey, derivedKey, iv, tag);

    // Decrypt metadata to get original filename and content type
    const metadataIv = toBufferIfNecessary(file.encryptedMetadata.iv);
    const metadataTag = toBufferIfNecessary(file.encryptedMetadata.tag);
    const encryptedMetadata = toBufferIfNecessary(file.encryptedMetadata.data);
    const decryptedMetadata = JSON.parse(decryptData(encryptedMetadata, vaultKey, metadataIv, metadataTag));

    // Decrypt file content
    const fileIv = toBufferIfNecessary(file.encryption.fileIv);
    const keyTag = toBufferIfNecessary(file.encryption.keyTag);
    const encryptedFileKey = toBufferIfNecessary(file.encryption.fileKey);
    const fileKey = decryptData(encryptedFileKey, vaultKey, fileIv, keyTag);

    const { Body } = await s3Client.send(new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Key,
    }));

    const chunks = [];
    for await (const chunk of Body) chunks.push(chunk);
    const encryptedBuffer = Buffer.concat(chunks);

    const fileTag = toBufferIfNecessary(file.encryption.fileTag);
    const decryptedFile = decryptData(encryptedBuffer, fileKey, fileIv, fileTag);

    res.setHeader('Content-Type', decryptedMetadata.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${decryptedMetadata.name}"`);
    res.send(decryptedFile);
  } catch (err) {
    console.error('❌ File decryption failed:', err);
    if (err.code === 'OSSL_EVP_BAD_DECRYPT' || err.message.includes('bad decrypt')) {
      return res.status(400).json({ 
        message: 'Invalid decryption password',
        code: 'WRONG_PASSWORD'
      });
    }
    res.status(500).json({ message: 'Failed to decrypt file' });
  }
});

// 🟡 Vault Status Check
router.get('/vault-status', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const initialized = !!(user.vaultKey && user.vaultKey.encrypted);
    
    // Check for vault corruption
    const corrupted = user.vaultKey?.encrypted && !user.vaultKey.tag;
    
    res.json({ 
      initialized,
      corrupted,
      hasAllFields: user.vaultKey ? 
        ['encrypted', 'salt', 'iv', 'tag'].every(field => user.vaultKey[field]) : 
        false
    });
  } catch (err) {
    console.error('Vault status error:', err);
    res.status(500).json({ message: 'Vault status check failed' });
  }
});

// 📊 List Files
router.get('/files', authenticateJWT, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id })
      .select('-encryption') // Don't send encryption details
      .sort({ createdAt: -1 });
    
    res.json({ files });
  } catch (err) {
    console.error('❌ List files error:', err);
    res.status(500).json({ message: 'Failed to list files' });
  }
});

// 🗑️ Delete File
router.delete('/files/:id', authenticateJWT, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Delete from S3
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.s3Key,
    }));

    // Delete from database
    await File.deleteOne({ _id: req.params.id });

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('❌ Delete file error:', err);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

export default router;