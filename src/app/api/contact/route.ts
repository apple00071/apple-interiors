import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, location, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !type || !location) {
      return NextResponse.json(
        { error: 'Name, email, phone, property type, and location are required' },
        { status: 400 }
      );
    }

    // Prepare the data for Google Sheets
    const timestamp = new Date().toISOString();
    const values = [[timestamp, name, email, phone, type, location, message || '']];

    // Append data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return NextResponse.json(
      { message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
} 