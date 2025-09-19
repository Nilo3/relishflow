/* eslint-disable */
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

// In Lambda, AWS credentials are automatically provided through IAM roles
const AuthConfig = new CognitoIdentityProviderClient({
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

export default AuthConfig;
