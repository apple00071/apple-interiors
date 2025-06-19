'use server';

import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  type: string;
  location: string;
  message: string;
}

// Helper function to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export async function submitContactForm(formData: ContactFormData) {
  try {
    console.log('Contact form submission received:', formData);

    // Check environment variables
    if (!process.env.GMAIL_USER) {
      console.error('Missing GMAIL_USER environment variable');
      return {
        success: false,
        error: 'Email configuration is missing'
      };
    }
    
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error('Missing GMAIL_APP_PASSWORD environment variable');
      return {
        success: false,
        error: 'Email configuration is missing'
      };
    }

    const { name, email, phone, type, location, message } = formData;

    // Validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !type?.trim() || !location?.trim()) {
      return {
        success: false,
        error: 'All fields are required'
      };
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email address'
      };
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

      return { 
        success: true,
        message: 'Form submitted successfully',
        messageId: info.messageId 
      };
    } catch (error) {
      console.error('Email Send Error:', error);
      return { 
        success: false,
        error: 'Failed to send email: ' + (error instanceof Error ? error.message : 'Unknown error')
      };
    }
  } catch (error) {
    console.error('General Error:', error);
    return { 
      success: false,
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  }
} 