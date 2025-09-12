# Apple Interiors Website

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/apple00071/apple-interiors.git
cd apple-interiors
```

2. Set up environment variables:
- Create a `.env` file in the root directory
- Add your Resend API key:
```
RESEND_API_KEY=your_api_key_here
```

3. Deploy to Vercel:
```bash
vercel
```

4. Configure Vercel environment variables:
- Go to your Vercel project settings
- Add the following environment variable:
  - Name: `RESEND_API_KEY`
  - Value: Your Resend API key

## Email Configuration

1. Sign up for [Resend](https://resend.com)
2. Verify your domain in Resend dashboard
3. Update the `FROM_EMAIL` in `api/send-email.js` with your verified domain
4. Update the `ADMIN_EMAIL` in `api/send-email.js` with your email address

## Development

1. Install a local server (e.g., Python's built-in server):
```bash
python -m http.server 3000
```

2. Open http://localhost:3000 in your browser

## SEO

The website includes:
- Meta tags for SEO
- Open Graph tags for social sharing
- Twitter Card tags
- JSON-LD structured data
- Canonical URLs
- Robots meta tags
- Sitemap
- Proper heading hierarchy
- Alt text for images
- Mobile-friendly design

## Security

- Environment variables for sensitive data
- Security headers in vercel.json
- CORS configuration
- XSS protection
- Content Security Policy
- SSL/TLS encryption (via Vercel)
