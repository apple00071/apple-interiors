import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Helper function to validate email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { name, email, phone, type, location, message } = body;

    // Enhanced validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !type?.trim() || !location?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify transporter connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP Connection Error:', verifyError);
      return NextResponse.json(
        { error: 'Email service unavailable' },
        { status: 503, headers: corsHeaders }
      );
    }

    // Create email content
    const mailOptions = {
      from: {
        name: 'Apple Interiors Website',
        address: process.env.GMAIL_USER as string
      },
      to: 'aravind.bandaru@appleinteriors.in',
      subject: `New Contact Form Submission: ${type}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333366; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h1>
          
          <div style="margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Property Type:</strong> ${type}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap;">${message || 'No message provided'}</p>
          </div>

          <div style="margin-top: 20px; font-size: 12px; color: #999;">
            This message was sent from the contact form on Apple Interiors website.
          </div>
        </div>
      `,
      replyTo: email,
    };

    // Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);

      return NextResponse.json(
        { message: 'Form submitted successfully' },
        { status: 200, headers: corsHeaders }
      );
    } catch (sendError) {
      console.error('Error sending email:', sendError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? 
          error instanceof Error ? error.toString() : 'Unknown error' 
          : undefined
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(null, {
    status: 200,
    headers: corsHeaders
  });
} 