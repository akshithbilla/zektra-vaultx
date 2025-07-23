// ✅ utils/cryptoUtils.js
import crypto from 'crypto';
import argon2 from 'argon2';

// Generate secure random key or IV
export function generateRandomKey(len) {
  return crypto.randomBytes(len);
}

// Derive a vaultKey from password using Argon2id
export async function deriveKeyArgon2(password, saltHex) {
  const salt = Buffer.isBuffer(saltHex) ? saltHex : Buffer.from(saltHex, 'hex');
  
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      salt,
      hashLength: 32,
      timeCost: 4,
      memoryCost: 2 ** 16, // 64 MB
      parallelism: 2,
      raw: true // Return Buffer directly
    });
    
    return hash;
  } catch (err) {
    console.error('❌ Argon2 key derivation failed:', err);
    throw new Error('Password derivation failed');
  }
}

// Encrypt data using AES-256-GCM
export function encryptData(data, key, iv) {
  try {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(data);
    const final = cipher.final();
    encrypted = Buffer.concat([encrypted, final]);
    
    const tag = cipher.getAuthTag();
    
    console.log('🔐 Encryption successful:', {
      dataLength: data.length,
      encryptedLength: encrypted.length,
      tagLength: tag.length,
      hasTag: !!tag
    });
    
    return { encrypted, tag };
  } catch (err) {
    console.error('❌ Encryption failed:', err);
    throw new Error('Data encryption failed');
  }
}

// Decrypt data using AES-256-GCM
export function decryptData(encrypted, key, iv, tag) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted);
    const final = decipher.final();
    decrypted = Buffer.concat([decrypted, final]);
    
    return decrypted;
  } catch (err) {
    console.error('❌ Decryption failed:', err);
    
    // Provide more specific error messages
    if (err.code === 'OSSL_EVP_BAD_DECRYPT') {
      throw new Error('Invalid password or corrupted data');
    }
    
    throw new Error('Data decryption failed');
  }
}

// Convert to Buffer from string, Buffer, or object
export function toBufferIfNecessary(val, encoding = 'hex') {
  if (!val) {
    console.error('❌ Buffer conversion failed: Value is', val);
    throw new Error('Value to convert to Buffer is missing');
  }
  
  if (Buffer.isBuffer(val)) {
    return val;
  }
  
  if (typeof val === 'string') {
    return Buffer.from(val, encoding);
  }
  
  // Handle MongoDB Buffer objects
  if (typeof val === 'object' && val.type === 'Buffer' && Array.isArray(val.data)) {
    return Buffer.from(val.data);
  }
  
  console.error('❌ Unsupported buffer format:', { type: typeof val, val });
  throw new Error('Unsupported format for buffer conversion');
}

// Validate hex string
export function isValidHex(str) {
  if (typeof str !== 'string') return false;
  return /^[0-9a-fA-F]+$/.test(str) && str.length % 2 === 0;
}

// Generate a secure random password
export function generateSecurePassword(length = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// Hash password for storage (different from key derivation)
export async function hashPassword(password) {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      timeCost: 4,
      memoryCost: 2 ** 16,
      parallelism: 2,
    });
  } catch (err) {
    console.error('❌ Password hashing failed:', err);
    throw new Error('Password hashing failed');
  }
}

// Verify password against hash
export async function verifyPassword(password, hash) {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    console.error('❌ Password verification failed:', err);
    return false;
  }
}