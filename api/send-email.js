// Import Resend SDK
import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set in environment variables');
    throw new Error('Email service is not properly configured');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { formData } = req.body;
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.phone) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Send email to admin
        await resend.emails.send({
            from: 'Apple Interiors <noreply@appleinteriors.in>', // Your verified domain
            to: 'aravind.bandaru@appleinteriors.in', // Your email
            subject: `New Contact Form Submission from ${formData.name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${formData.name}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
                <p><strong>Subject:</strong> ${formData.subject || 'Not specified'}</p>
                <p><strong>Message:</strong></p>
                <p>${formData.message || 'No message provided'}</p>
            `,
        });

        // Send confirmation email to user
        await resend.emails.send({
            from: 'Apple Interiors <noreply@appleinteriors.in>',
            to: formData.email,
            subject: 'Thank you for contacting Apple Interiors',
            html: `
                <h2>Thank you for contacting Apple Interiors!</h2>
                <p>Dear ${formData.name},</p>
                <p>We have received your message and will get back to you within 24 hours.</p>
                <p>For immediate assistance, please call us at +91 9603 9603 37 or WhatsApp us.</p>
                <p>Best regards,<br/>The Apple Interiors Team</p>
            `,
        });

        return res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('Email sending error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            code: error.code
        });
        
        // More specific error messages
        let errorMessage = 'Failed to send email';
        if (error.name === 'MissingRequiredFieldError') {
            errorMessage = 'Missing required email fields';
        } else if (error.name === 'RateLimitExceededError') {
            errorMessage = 'Too many requests. Please try again later.';
        } else if (error.name === 'AuthenticationError') {
            errorMessage = 'Email service authentication failed. Please check your API key.';
        }
        
        return res.status(500).json({ 
            success: false, 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}
