import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkSchema() {
  try {
    // Check tables
    console.log('Checking tables...');
    const tables = await sql`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
    
    console.log('Tables found:');
    tables.forEach(col => {
      console.log(`${col.table_name}.${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Failed to check schema:', error);
    process.exit(1);
  }
}

checkSchema(); 