'use server';

import { Resend } from 'resend';
import env from '../lib/env';

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

// Email templates
const getAdminEmailHtml = (data: ContactFormData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333366; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h1>
    
    <div style="margin: 20px 0;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Property Type:</strong> ${data.type}</p>
      <p><strong>Location:</strong> ${data.location}</p>
    </div>

    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
      <strong>Message:</strong>
      <p style="white-space: pre-wrap;">${data.message || 'No message provided'}</p>
    </div>

    <div style="margin-top: 20px; font-size: 12px; color: #999;">
      This message was sent from the contact form on Apple Interiors website.
    </div>
  </div>
`;

const getUserEmailHtml = (data: ContactFormData) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333366; border-bottom: 1px solid #eee; padding-bottom: 10px;">Thank You for Contacting Apple Interiors</h1>
    
    <div style="margin: 20px 0;">
      <p>Dear ${data.name},</p>
      
      <p>Thank you for reaching out to Apple Interiors. We have received your inquiry regarding ${data.type} interior design services.</p>
      
      <p>Our team will review your request and get back to you within 24-48 hours at the following contact details:</p>
      <ul style="list-style: none; padding-left: 0;">
        <li>Email: ${data.email}</li>
        <li>Phone: ${data.phone}</li>
      </ul>

      <p>For your reference, here's a summary of your inquiry:</p>
      <ul style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <li><strong>Property Type:</strong> ${data.type}</li>
        <li><strong>Location:</strong> ${data.location}</li>
        ${data.message ? `<li><strong>Message:</strong> ${data.message}</li>` : ''}
      </ul>

      <p>For immediate assistance, click here to reach us on WhatsApp:</p>
      <p style="margin: 20px 0;">
        <a href="https://wa.me/919603960337?text=Hi%20Apple%20Interiors%2C%0A%0AI%20just%20submitted%20an%20inquiry%20on%20your%20website%20for%20${encodeURIComponent(data.type)}%20interior%20design%20in%20${encodeURIComponent(data.location)}.%0A%0AMy%20name%20is%20${encodeURIComponent(data.name)}%20and%20I%27d%20like%20to%20discuss%20my%20requirements.%0A%0AThank%20you!" style="background-color: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Chat on WhatsApp</a>
      </p>
      
      <div style="margin-top: 30px;">
        <p>Best regards,</p>
        <p style="font-weight: bold; color: #333366;">Apple Interiors Team</p>
        <p style="margin-top: 10px;">
          <strong>Apple Interiors</strong><br />
          Website: <a href="https://www.appleinteriors.in" style="color: #333366;">www.appleinteriors.in</a><br />
          Phone: <a href="tel:+919603960337" style="color: #333366;">+91 96039 60337</a><br />
          Email: <a href="mailto:appleinteriorsinfra@gmail.com" style="color: #333366;">appleinteriorsinfra@gmail.com</a>
        </p>
      </div>
    </div>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
      <p>This email was sent in response to your inquiry on our website. Please add appleinteriorsinfra@gmail.com to your address book to ensure you receive our communications.</p>
    </div>
  </div>
`;

export async function submitContactForm(formData: ContactFormData) {
  try {
    console.log('Contact form submission received:', formData);

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

    if (!env.RESEND_API_KEY) {
      console.error('Missing Resend API key');
      return {
        success: false,
        error: 'Email configuration is missing'
      };
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const uniqueId = new Date().getTime().toString();

    // Send notification email to admin
    try {
      const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
        from: 'Apple Interiors <info@appleinteriors.in>',
        to: ['appleinteriorsinfra@gmail.com'],
        subject: `New Contact Form Submission: ${type}`,
        html: getAdminEmailHtml(formData),
        text: `New inquiry from ${name} (${email}) for ${type} project in ${location}. Phone: ${phone}. Message: ${message || 'No message provided'}`,
        replyTo: email,
        tags: [
          {
            name: 'category',
            value: 'contact_form'
          },
          {
            name: 'type',
            value: type.toLowerCase().replace(/\s+/g, '_')
          }
        ],
        headers: {
          'X-Entity-Ref-ID': uniqueId,
          'List-Unsubscribe': `<mailto:unsubscribe@appleinteriors.in?subject=unsubscribe>`,
          'Precedence': 'bulk'
        }
      });

      if (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
      } else {
        console.log('Admin notification email sent successfully:', adminEmailData);
      }
    } catch (error) {
      console.error('Failed to send admin notification:', error);
    }

    // Send confirmation email to user
    try {
      const { data: userEmailData, error: userEmailError } = await resend.emails.send({
        from: 'Apple Interiors <info@appleinteriors.in>',
        to: [email],
        subject: 'Thank You for Contacting Apple Interiors',
        html: getUserEmailHtml(formData),
        text: `Dear ${name},\n\nThank you for contacting Apple Interiors. We have received your inquiry regarding ${type} interior design services.\n\nOur team will review your request and get back to you within 24-48 hours.\n\nBest regards,\nApple Interiors Team`,
        tags: [
          {
            name: 'category',
            value: 'auto_response'
          }
        ],
        headers: {
          'X-Entity-Ref-ID': `${uniqueId}-user`,
          'List-Unsubscribe': `<mailto:unsubscribe@appleinteriors.in?subject=unsubscribe>`,
          'Precedence': 'bulk',
          'X-Auto-Response-Suppress': 'OOF, AutoReply',
          'Auto-Submitted': 'auto-generated',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high'
        }
      });

      if (userEmailError) {
        console.error('Failed to send user confirmation:', userEmailError);
        return {
          success: false,
          error: 'Failed to send confirmation email. Please try again later.'
        };
      } else {
        console.log('User confirmation email sent successfully:', userEmailData);
      }
    } catch (error) {
      console.error('Failed to send user confirmation:', error);
      return {
        success: false,
        error: 'Failed to send confirmation email. Please try again later.'
      };
    }

    return {
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    };
  } catch (error) {
    console.error('Error in submitContactForm:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
} 