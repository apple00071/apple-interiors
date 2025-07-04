const requiredEnvVars = [
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'JWT_SECRET',
] as const;

// Validate environment variables
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const env = {
  ADMIN_USERNAME: process.env.ADMIN_USERNAME!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
  JWT_SECRET: process.env.JWT_SECRET!,
} as const; 