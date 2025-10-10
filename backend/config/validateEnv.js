const requiredEnvVars = [
  'GITHUB_API_KEY',
  'MONGO_URL',
  'GITHUB_CLIENT_SECRET',
  'SESSION_SECRET'
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    process.exit(1);
  }

  // Validate GitHub token format
  if (!process.env.GITHUB_API_KEY?.startsWith('ghp_')) {
    console.error('❌ Invalid GitHub token format');
    process.exit(1);
  }

  // Validate MongoDB URL format
  if (!process.env.MONGO_URL?.includes('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URL format');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
};

export default validateEnv;