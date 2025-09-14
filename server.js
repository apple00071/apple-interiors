const http = require('http');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer(async (req, res) => {
  // Handle API requests
  if (req.url === '/api/send-email' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { formData } = JSON.parse(body);
        
        // Send email to test email for verification
        await resend.emails.send({
          from: 'Apple Interiors <noreply@appleinteriors.in>',
          to: 'pavankumarv1497@gmail.com',
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

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        console.error('Email sending error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Failed to send email',
          details: error.message
        }));
      }
    });
  } else {
    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.readFile('./404.html', (error, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
