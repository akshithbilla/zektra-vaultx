import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { File } from '../models/File.js';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No user ID found'
      });
    }

    // Generate unique key for S3
    const fileExtension = req.file.originalname.split('.').pop();
    const s3Key = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    await s3.send(new PutObjectCommand(uploadParams));
    
    // Construct the URL (S3 doesn't return Location in v3 for PutObjectCommand)
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    // Save file metadata to database
    const newFile = await File.create({
      userId: req.user.id,
      name: req.file.originalname,
      s3Key: s3Key,
      url: fileUrl,
      type: req.file.mimetype,
      size: req.file.size,
      storageType: req.body.storageType || 'docsafe',
      tags: req.body.tags ? req.body.tags.split(',') : [],
      contentType: req.file.mimetype
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: newFile._id,
        name: newFile.name,
        url: newFile.url,
        type: newFile.type,
        size: newFile.size,
        storageType: newFile.storageType,
        tags: newFile.tags,
        createdAt: newFile.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};