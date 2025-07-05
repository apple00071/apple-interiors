import { NextResponse } from 'next/server';
import { testDatabaseConnection, executeQuery } from '../../lib/db';

interface DatabaseError extends Error {
  code?: string;
}

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const connectionResult = await testDatabaseConnection();
    console.log('Connection test result:', connectionResult);

    if (!connectionResult.success) {
      return NextResponse.json(connectionResult, { status: 500 });
    }

    // Test admin_users table
    console.log('Testing admin_users table...');
    const adminUsers = await executeQuery({
      query: 'SELECT * FROM admin_users'
    });
    console.log('Admin users in database:', adminUsers);

    return NextResponse.json({
      success: true,
      message: 'Database connection and queries successful',
      connectionTest: connectionResult,
      adminUsers
    });
  } catch (error) {
    const err = error as DatabaseError;
    console.error('Database test error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
} 