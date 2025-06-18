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

export async function POST(req: NextRequest) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Parse the request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    const { name, email, phone, type, location, message } = body;

    // Enhanced validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !type?.trim() || !location?.trim()) {
      return new NextResponse(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    if (!isValidEmail(email)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid email address' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
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
      await transporter.verify();
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);

      return new NextResponse(
        JSON.stringify({ message: 'Form submitted successfully' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    } catch (error) {
      console.error('Error sending email:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
  } catch (error) {
    console.error('Error processing form:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development'
          ? error instanceof Error ? error.toString() : 'Unknown error'
          : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
} 