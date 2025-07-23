import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  s3Key: { type: String, required: true },
  encryptedMetadata: {
    data: String,  // hex string of encrypted Buffer
    iv: String,    // IV used for metadata encryption
    tag: String    // GCM auth tag
  },
  encryption: {
    fileKey: String,         // Hex string instead of Buffer
    fileIv: String,          // IV for file encryption (hex string)
    fileTag: String,         // Auth tag for encrypted file (hex string)
    keyTag: String           // Auth tag for encrypted fileKey (hex string)
  },
  createdAt: { type: Date, default: Date.now }
  // Removed plaintext fields: name, contentType, size, storageType, tags
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);
export { File };