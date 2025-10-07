// API Endpoint for Apple Interiors Contact Form
// Serverless function to send emails via Resend API

const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_cBhHvgdz_6KB4XdZoXAVN5BgFDWW83oQu');

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Set CORS headers for all responses
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST.'
        });
    }

    try {
        // Parse request body
        const { formData, config } = req.body;

        // Validate required fields
        if (!formData || !formData.name || !formData.email || !formData.phone) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, email, phone'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Prepare email content
        const emailContent = {
            from: `${config?.companyName || 'Apple Interiors'} <${config?.fromEmail || 'noreply@appleinteriors.in'}>`,
            to: config?.adminEmail || 'aravind.bandaru@appleinteriors.in',
            subject: `New Contact Form Submission from ${formData.name}`,
            html: generateAdminEmail(formData)
        };

        const userEmailContent = {
            from: `${config?.companyName || 'Apple Interiors'} <${config?.fromEmail || 'noreply@appleinteriors.in'}>`,
            to: formData.email,
            subject: `Thank you for contacting ${config?.companyName || 'Apple Interiors'}`,
            html: generateUserEmail(formData)
        };

        // Send both emails
        const [adminResult, userResult] = await Promise.all([
            resend.emails.send(emailContent),
            resend.emails.send(userEmailContent)
        ]);

        console.log('Emails sent successfully:', {
            adminId: adminResult.data?.id,
            userId: userResult.data?.id
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Emails sent successfully',
            adminEmailId: adminResult.data?.id,
            userEmailId: userResult.data?.id
        });

    } catch (error) {
        console.error('Email sending error:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        });

        // Handle specific Resend errors
        let errorMessage = 'Failed to send email';
        let statusCode = 500;

        if (error.name === 'MissingRequiredFieldError') {
            errorMessage = 'Missing required email fields';
            statusCode = 400;
        } else if (error.name === 'RateLimitExceededError') {
            errorMessage = 'Too many requests. Please try again later.';
            statusCode = 429;
        } else if (error.name === 'AuthenticationError') {
            errorMessage = 'Email service authentication failed. Please check your API key.';
            statusCode = 401;
        }

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Generate admin email HTML
function generateAdminEmail(formData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>New Contact Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #eab308; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #555; }
                .field-value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>New Contact Form Submission</h1>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="field-label">Name:</div>
                        <div class="field-value">${formData.name}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">${formData.email}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Phone:</div>
                        <div class="field-value">${formData.phone}</div>
                    </div>
                    ${formData.type ? `
                    <div class="field">
                        <div class="field-label">Property Type:</div>
                        <div class="field-value">${formData.type}</div>
                    </div>
                    ` : ''}
                    ${formData.location ? `
                    <div class="field">
                        <div class="field-label">Location:</div>
                        <div class="field-value">${formData.location}</div>
                    </div>
                    ` : ''}
                    ${formData.message ? `
                    <div class="field">
                        <div class="field-label">Message:</div>
                        <div class="field-value">${formData.message.replace(/\n/g, '<br>')}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </body>
        </html>
    `;
}

// Generate user confirmation email HTML
function generateUserEmail(formData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Thank you for contacting Apple Interiors</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #eab308; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #eab308; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .contact-info { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Thank you for contacting Apple Interiors!</h1>
                </div>
                <div class="content">
                    <p>Dear ${formData.name},</p>
                    <p>We have received your message and will get back to you within 24 hours.</p>
                    <p>For immediate assistance, please call us at <strong>+91 9603 9603 37</strong> or WhatsApp us.</p>

                    <div class="contact-info">
                        <h3>Contact Information:</h3>
                        <p><strong>Phone:</strong> +91 9603 9603 37</p>
                        <p><strong>Email:</strong> aravind.bandaru@appleinteriors.in</p>
                        <p><strong>Office:</strong> Kukatpally, Hyderabad</p>
                    </div>

                    <p>Best regards,<br>The Apple Interiors Team</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
