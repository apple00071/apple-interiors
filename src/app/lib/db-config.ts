import { Pool } from 'pg';

// Declare global variable for database connection
declare global {
  var pg: Pool | undefined;
}

const pool = global.pg || new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_M0jZJHs9OSKY@ep-muddy-flower-a86z1fws-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// In development, preserve the pool across hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.pg = pool;
}

export default pool; 