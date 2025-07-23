import fs from 'fs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
dotenv.config();

// AWS SDK v3 S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  maxAttempts: 3,
  retryMode: 'standard'
});

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('AWS credentials are missing!');
  process.exit(1);
}

// Upload file to S3 (v3, streaming from disk)
export const uploadFileToS3 = async (file) => {
  try {
    const fileStream = fs.createReadStream(file.path);
    const fileExtension = file.originalname.split('.').pop();
    const key = `${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileStream,
      ContentType: file.mimetype,
      // ACL: 'private' // For v3, specify in S3 policy, or add here if needed
    };

    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Clean up the temporary file
    fs.unlinkSync(file.path);
    
    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      key,
      bucket: process.env.AWS_BUCKET_NAME
    };
  } catch (error) {
    // Clean up the temporary file in case of error
    if (file && file.path) {
      try { fs.unlinkSync(file.path); } catch (e) {}
    }
    throw error;
  }
};

// Delete file from S3 (v3)
export const deleteFileFromS3 = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };
  return s3Client.send(new DeleteObjectCommand(params));
};