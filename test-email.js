const { Resend } = require('resend');

async function testEmail() {
  try {
    const resend = new Resend('re_jPLyY46h_AmNbHWjmPGGdVGqV9WfdPJsH');
    
    console.log('Sending test email...');
    
    const { data, error } = await resend.emails.send({
      from: 'Apple Interiors <noreply@appleinteriors.in>',
      to: ['pavankumarv1497@gmail.com'],
      subject: 'Test Email from Apple Interiors',
      html: '<strong>This is a test email from Apple Interiors</strong>'
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testEmail();
