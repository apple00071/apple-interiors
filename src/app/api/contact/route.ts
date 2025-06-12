import { NextResponse } from 'next/server';

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

    // For static exports, you'll need to handle form submissions client-side
    // This could be through a third-party form service or your own API endpoint
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