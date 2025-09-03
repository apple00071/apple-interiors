import 'dotenv/config';

// Load and validate environment variables
const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
};

// Validate required environment variables
Object.entries(env).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export default env; 