/* eslint-disable */
import { S3Client } from '@aws-sdk/client-s3';

// In Lambda, AWS credentials are automatically provided through IAM roles
// No need to explicitly set credentials unless running locally
const S3Config = new S3Client({
  region: process.env.AWS_REGION || 'sa-east-1',
  // In Lambda, omit credentials to use IAM role
  // For local development, you can set AWS_PROFILE or use aws configure
  ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  }),
});

export default S3Config;