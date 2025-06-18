import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function POST(request) {
  try {
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    // Parse request body
    const body = await request.json();
    console.log('Contact form submission received:', body);

    // Check environment variables
    if (!process.env.GMAIL_USER) {
      console.error('Missing GMAIL_USER environment variable');
      return NextResponse.json(
        { error: 'Email configuration is missing' },
        { status: 500 }
      );
    }
    
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing GMAIL_APP_PASSWORD environment variable');
      return NextResponse.json(
        { error: 'Email configuration is missing' },
        { status: 500 }
      );
    }

    const { name, email, phone, type, location, message } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !type?.trim() || !location?.trim()) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Create email content
    const mailOptions = {
      from: {
        name: 'Apple Interiors Website',
        address: process.env.GMAIL_USER
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
      console.log('Attempting to send email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);

      return NextResponse.json({ 
        message: 'Form submitted successfully',
        messageId: info.messageId 
      }, { status: 200 });
    } catch (error) {
      console.error('Email Send Error:', error);
      return NextResponse.json({ 
        error: 'Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error')
      }, { status: 500 });
    }
  } catch (error) {
    console.error('General Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request) {
  console.log('OPTIONS request received:', request.url);
  
  return NextResponse.json({}, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 