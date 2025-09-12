# Resend API Setup Guide for Apple Interiors Contact Form

This guide explains how the Resend API integration works for the Apple Interiors contact form and how to configure it properly.

## 🚀 Current Setup

The contact form is configured with Resend API integration using environment variables for secure API key management.

### How It Works

1. **Customer fills out contact form** on the website
2. **Form data is sent** to `/api/send-email` serverless function
3. **Two emails are sent simultaneously**:
   - **Admin notification** to `aravind.bandaru@appleinteriors.in`
   - **Customer confirmation** to the customer's email
4. **WhatsApp fallback** option is provided for immediate contact

## 📧 Email Templates

### Admin Notification Email
- **Subject**: `New Inquiry from Apple Interiors Website - [Customer Name]`
- **Content**: Professional email with customer details, inquiry information, and action buttons
- **Features**: Direct reply and call buttons, formatted customer data

### Customer Confirmation Email
- **Subject**: `Thank you for contacting Apple Interiors - [Customer Name]`
- **Content**: Welcome message, next steps, contact information, and portfolio link
- **Features**: Call and WhatsApp buttons, company information, social links

## 🔧 Technical Implementation

### Environment Variables Setup

1. Create a `.env` file in the root directory (use `.env.example` as a template)
2. Add your Resend API key:
```
RESEND_API_KEY=your_actual_api_key_here
```
3. Deploy with environment variables configured in your hosting platform (Vercel, etc.)

### Serverless Function (`/api/send-email.js`)
```javascript
// Handles email sending securely on server-side
// Uses Resend API with proper error handling
// Sends both admin and customer emails
// Returns success/failure status
```

### Frontend Integration (`contact.js`)
```javascript
// Validates form data
// Sends request to serverless API
// Handles success/error states
// Provides WhatsApp fallback
```

## 🛡️ Security Features

1. **API Key Protection**: Resend API key is stored securely in serverless function
2. **Server-side Processing**: All email sending happens on the server
3. **Input Validation**: Form data is validated before processing
4. **Error Handling**: Graceful fallback to WhatsApp if emails fail

## 📊 Email Delivery Status

The system provides dual email delivery:
- ✅ **Admin Email**: Notifies business owner of new inquiries
- ✅ **Customer Email**: Confirms receipt and provides next steps
- 🔄 **Fallback**: WhatsApp option if email delivery fails

## 🔍 Troubleshooting

### Common Issues:

1. **Emails not being sent**:
   - Check if Resend API key is valid
   - Verify domain is configured in Resend dashboard
   - Check browser console for API errors

2. **Emails going to spam**:
   - Verify sender domain with Resend
   - Add SPF/DKIM records to DNS
   - Use professional from address

3. **API endpoint not working**:
   - Ensure serverless function is deployed
   - Check Vercel function logs
   - Verify API endpoint URL

### Testing the Contact Form:

1. Fill out the contact form with test data
2. Submit the form
3. Check for success message
4. Verify admin email received
5. Check customer confirmation email
6. Test WhatsApp fallback option

## 🌐 Domain Configuration

For production use, you should:

1. **Verify your domain** with Resend:
   - Add your domain (e.g., `appleinteriors.in`) to Resend
   - Configure DNS records (SPF, DKIM)
   - Update `FROM_EMAIL` in the serverless function

2. **Update email addresses**:
   ```javascript
   const FROM_EMAIL = 'noreply@appleinteriors.in'; // Your verified domain
   const ADMIN_EMAIL = 'aravind.bandaru@appleinteriors.in'; // Admin email
   ```

## 📈 Resend API Limits

### Free Plan:
- 3,000 emails per month
- 100 emails per day
- Basic support

### Paid Plans:
- Up to 100,000+ emails per month
- Higher daily limits
- Priority support
- Advanced analytics

## 🔄 Backup & Fallback

The system includes multiple fallback mechanisms:

1. **Primary**: Resend API email delivery
2. **Secondary**: WhatsApp integration for immediate contact
3. **Tertiary**: Direct phone call options
4. **Quaternary**: Manual form data collection (always works)

## 📞 Support & Maintenance

### Monitoring:
- Check Resend dashboard for delivery statistics
- Monitor Vercel function logs for errors
- Track form submission success rates

### Updates:
- API key rotation (if needed)
- Email template updates
- Domain configuration changes

## ✅ Production Checklist

Before going live:

- [ ] Environment variables are properly set up
- [ ] Resend API key is working
- [ ] Domain is verified with Resend
- [ ] DNS records are configured
- [ ] Test emails are being delivered
- [ ] Admin notifications are working
- [ ] Customer confirmations are working
- [ ] WhatsApp fallback is functional
- [ ] Form validation is working
- [ ] Error handling is tested

## 🎯 Benefits of Current Setup

1. **Professional Email Delivery**: Using Resend API for reliable email sending
2. **Dual Email System**: Both admin and customer receive appropriate emails
3. **Beautiful Templates**: Professional HTML email templates
4. **Secure Implementation**: API keys protected on server-side
5. **Fallback Options**: WhatsApp integration for immediate contact
6. **Easy Maintenance**: Simple serverless architecture
7. **Scalable**: Can handle high volume of inquiries

---

**The contact form is production-ready and will reliably deliver emails to both admin and customers!** 🎉

For technical support or modifications, contact your web developer.
