const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const EMAIL_CONFIG = {
    from: process.env.FROM_EMAIL || 'Apple Interiors <noreply@appleinteriors.in>',
    adminEmail: process.env.ADMIN_EMAIL || 'aravind.bandaru@appleinteriors.in',
    companyName: 'Apple Interiors',
    companyPhone: '+91 9603 9603 37',
    companyWebsite: 'https://appleinteriors.in'
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

function validateFormData(data) {
    const errors = [];
    
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Full name is required and must be at least 2 characters');
    }
    
    if (!data.emailAddress || !validateEmail(data.emailAddress)) {
        errors.push('Valid email address is required');
    }
    
    if (!data.phoneNumber || !validatePhone(data.phoneNumber)) {
        errors.push('Valid phone number is required');
    }
    
    return errors;
}

// Email template functions
function generateAdminEmailHTML(formData) {
    const timestamp = new Date().toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short'
    });
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏠 New Contact Inquiry</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">${EMAIL_CONFIG.companyName}</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 20px;">👤 Customer Information</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #6c757d; width: 30%;">Name:</td>
                            <td style="padding: 8px 0; color: #495057;">${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Email:</td>
                            <td style="padding: 8px 0; color: #495057;">
                                <a href="mailto:${formData.emailAddress}" style="color: #007bff; text-decoration: none;">${formData.emailAddress}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Phone:</td>
                            <td style="padding: 8px 0; color: #495057;">
                                <a href="tel:${formData.phoneNumber}" style="color: #007bff; text-decoration: none;">${formData.phoneNumber}</a>
                            </td>
                        </tr>
                    </table>
                </div>
                
                ${formData.propertyType || formData.projectLocation || formData.budget ? `
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #1976d2; margin: 0 0 15px 0; font-size: 20px;">🏗️ Project Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${formData.propertyType ? `
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #1565c0; width: 30%;">Property Type:</td>
                            <td style="padding: 8px 0; color: #1976d2;">${formData.propertyType}</td>
                        </tr>
                        ` : ''}
                        ${formData.projectLocation ? `
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #1565c0;">Location:</td>
                            <td style="padding: 8px 0; color: #1976d2;">${formData.projectLocation}</td>
                        </tr>
                        ` : ''}
                        ${formData.budget ? `
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #1565c0;">Budget:</td>
                            <td style="padding: 8px 0; color: #1976d2;">${formData.budget}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
                ` : ''}
                
                ${formData.projectMessage ? `
                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #f57c00; margin: 0 0 15px 0; font-size: 20px;">💬 Customer Message</h2>
                    <p style="color: #ef6c00; margin: 0; white-space: pre-wrap; line-height: 1.6;">${formData.projectMessage}</p>
                </div>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="mailto:${formData.emailAddress}?subject=Re: Your Interior Design Inquiry" 
                       style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        📧 Reply via Email
                    </a>
                    <a href="tel:${formData.phoneNumber}" 
                       style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        📞 Call Customer
                    </a>
                    <a href="https://wa.me/${formData.phoneNumber.replace(/[^\d]/g, '')}?text=Hi%20${encodeURIComponent(formData.fullName)}%2C%20thank%20you%20for%20your%20interest%20in%20Apple%20Interiors.%20I%20received%20your%20inquiry%20and%20would%20like%20to%20discuss%20your%20project." 
                       style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        💬 WhatsApp
                    </a>
                </div>
                
                <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; text-align: center; color: #6c757d; font-size: 14px;">
                    <p style="margin: 0;">📅 Received on: ${timestamp}</p>
                    <p style="margin: 5px 0 0 0;">🌐 From: ${EMAIL_CONFIG.companyWebsite}</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateCustomerEmailHTML(formData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting Apple Interiors</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏠 ${EMAIL_CONFIG.companyName}</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Best Interior Designers in Hyderabad</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #495057; margin: 0 0 20px 0; font-size: 24px;">Thank you, ${formData.fullName}! 🎉</h2>
                
                <p style="color: #495057; font-size: 16px; margin-bottom: 20px;">
                    We have received your inquiry and are excited to help you transform your space into something beautiful and functional.
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">📋 Your Inquiry Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d; width: 30%;">Name:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Email:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.emailAddress}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Phone:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.phoneNumber}</td>
                        </tr>
                        ${formData.propertyType ? `
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Property Type:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.propertyType}</td>
                        </tr>
                        ` : ''}
                        ${formData.projectLocation ? `
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Location:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.projectLocation}</td>
                        </tr>
                        ` : ''}
                        ${formData.budget ? `
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Budget:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.budget}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>

                ${formData.projectMessage ? `
                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 18px;">💬 Your Message</h3>
                    <p style="color: #ef6c00; margin: 0; white-space: pre-wrap; line-height: 1.6; font-style: italic;">"${formData.projectMessage}"</p>
                </div>
                ` : ''}

                <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px;">⏰ What Happens Next?</h3>
                    <ul style="color: #388e3c; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Our design expert will review your requirements</li>
                        <li style="margin-bottom: 8px;">We'll contact you within 24 hours to discuss your project</li>
                        <li style="margin-bottom: 8px;">Schedule a free consultation at your convenience</li>
                        <li style="margin-bottom: 8px;">Receive a customized design proposal</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #495057; font-size: 16px; margin-bottom: 20px;">
                        <strong>Need immediate assistance?</strong>
                    </p>
                    <a href="tel:${EMAIL_CONFIG.companyPhone}" 
                       style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        📞 Call Us
                    </a>
                    <a href="https://wa.me/919603960337?text=Hi%2C%20I%20just%20submitted%20a%20contact%20form%20and%20would%20like%20to%20discuss%20my%20interior%20design%20project." 
                       style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        💬 WhatsApp
                    </a>
                </div>
                
                <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; text-align: center; color: #6c757d; font-size: 14px;">
                    <p style="margin: 0 0 10px 0;"><strong>${EMAIL_CONFIG.companyName}</strong></p>
                    <p style="margin: 0 0 5px 0;">📞 ${EMAIL_CONFIG.companyPhone}</p>
                    <p style="margin: 0 0 5px 0;">📧 ${EMAIL_CONFIG.adminEmail}</p>
                    <p style="margin: 0;">🌐 ${EMAIL_CONFIG.companyWebsite}</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Main handler function
module.exports = async function handler(req, res) {
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Only POST requests are accepted.'
        });
    }

    // Check API key
    if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY environment variable is not set');
        return res.status(500).json({
            success: false,
            error: 'Email service is not properly configured. Please try again later.'
        });
    }

    try {
        const formData = req.body;
        
        // Validate form data
        const validationErrors = validateFormData(formData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Send admin notification email
        const adminEmailResult = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: EMAIL_CONFIG.adminEmail,
            subject: `🏠 New Contact Inquiry from ${formData.fullName}`,
            html: generateAdminEmailHTML(formData)
        });

        // Send customer confirmation email
        const customerEmailResult = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: formData.emailAddress,
            subject: `Thank you for contacting ${EMAIL_CONFIG.companyName}`,
            html: generateCustomerEmailHTML(formData)
        });

        // Log success
        console.log('Emails sent successfully:', {
            admin: adminEmailResult.data?.id,
            customer: customerEmailResult.data?.id,
            timestamp: new Date().toISOString(),
            customerName: formData.fullName,
            customerEmail: formData.emailAddress
        });

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully! We will contact you within 24 hours.',
            emailIds: {
                admin: adminEmailResult.data?.id,
                customer: customerEmailResult.data?.id
            }
        });

    } catch (error) {
        console.error('Contact form submission error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        // Handle specific Resend API errors
        let errorMessage = 'Failed to send your message. Please try again.';
        let statusCode = 500;

        if (error.name === 'validation_error' || error.message?.includes('validation')) {
            errorMessage = 'There was an issue with the email addresses. Please check and try again.';
            statusCode = 400;
        } else if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            statusCode = 429;
        } else if (error.message?.includes('unauthorized') || error.message?.includes('invalid')) {
            errorMessage = 'Email service authentication failed. Please try again later.';
            statusCode = 401;
        }

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
            fallback: {
                whatsapp: `https://wa.me/919603960337?text=Hi%2C%20I%20tried%20to%20submit%20the%20contact%20form%20but%20encountered%20an%20issue.%20My%20name%20is%20${encodeURIComponent(req.body?.fullName || 'Customer')}%20and%20I%20would%20like%20to%20discuss%20interior%20design%20services.`,
                phone: EMAIL_CONFIG.companyPhone
            }
        });
    }
};
