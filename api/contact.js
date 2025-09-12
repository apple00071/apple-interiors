// Contact form API endpoint
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, type, location, budget, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Admin email content
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || 'website@example.com',
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: `New Contact Form Submission: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Property Type:</strong> ${type || 'Not specified'}</p>
        <p><strong>Location:</strong> ${location || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
        <p><strong>Message:</strong> ${message || 'No message provided'}</p>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
      `,
    };

    // Customer email content
    const customerMailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry and will get back to you as soon as possible.</p>
        <p>Here's a summary of the information you provided:</p>
        <ul>
          <li><strong>Property Type:</strong> ${type || 'Not specified'}</li>
          <li><strong>Location:</strong> ${location || 'Not specified'}</li>
          <li><strong>Budget:</strong> ${budget || 'Not specified'}</li>
          <li><strong>Message:</strong> ${message || 'No message provided'}</li>
        </ul>
        <p>If you have any urgent inquiries, please feel free to contact us directly at ${process.env.CONTACT_PHONE || '+1234567890'}.</p>
        <p>Best regards,<br>The Team</p>
      `,
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    // Return success response
    return res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ error: 'Failed to send emails', details: error.message });
  }
}