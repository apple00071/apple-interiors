# Apple Interiors - Professional HTML Website

A complete, modern, responsive website for Apple Interiors - Hyderabad's leading interior design company. Converted from Next.js to pure HTML for maximum performance and compatibility.

## 🎯 **PRODUCTION-READY FEATURES**

- ✅ **Complete Website** - 5 separate pages (Home, About, Services, Portfolio, Contact)
- ✅ **Working Contact Form** - Resend API integration with dual email system
- ✅ **Google Maps Integration** - Interactive maps on all pages
- ✅ **Fully Responsive** - Perfect on desktop, tablet, and mobile
- ✅ **SEO Optimized** - Complete meta tags, structured data, fast loading
- ✅ **Professional Design** - Exact replica of the original Next.js version
- ✅ **Email System** - Admin notifications + customer confirmations
- ✅ **WhatsApp Integration** - Fallback contact option

## 📁 **COMPLETE PROJECT STRUCTURE**

```
apple-interiors-converted/
├── index.html              # Home page
├── about.html              # About page
├── services.html           # Services page
├── portfolio.html          # Portfolio page
├── contact.html            # Contact page with working form
├── styles.css              # Custom CSS styles
├── script.js               # Main JavaScript functionality
├── contact.js              # Contact form with Resend API
├── api/
│   └── send-email.js       # Serverless function for email sending
├── images/                 # All images and assets (copied from Next.js)
│   ├── brands/             # Brand logos
│   ├── portfolio/          # Portfolio images by category
│   │   ├── bedroom/        # Bedroom designs
│   │   ├── living-room/    # Living room designs
│   │   ├── kitchen/        # Kitchen designs
│   │   ├── dining/         # Dining room designs
│   │   └── false-ceiling/  # False ceiling designs
│   └── seo/               # SEO and meta images
├── vercel.json             # Vercel deployment configuration
├── package.json            # Project metadata
├── .gitignore              # Git ignore rules
├── README.md               # This documentation
├── RESEND-SETUP.md         # Email setup guide
└── DEPLOY.md               # Deployment instructions
```

## 🌐 Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd apple-interiors-converted
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: `apple-interiors-html`
   - Directory: `./` (current directory)

### Method 2: Vercel Dashboard

1. **Prepare the project**
   - Zip the `apple-interiors-converted` folder
   - Or push to GitHub repository

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub or upload zip
   - Configure:
     - Framework Preset: **Other**
     - Root Directory: `./`
     - Build Command: Leave empty
     - Output Directory: `./`
   - Click "Deploy"

### Method 3: GitHub Integration

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/apple-interiors-html.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import from GitHub
   - Select the repository
   - Deploy

## 🔧 Local Development

1. **Using Node.js http-server**
   ```bash
   npm install -g http-server
   cd apple-interiors-converted
   http-server -p 3000
   ```

2. **Using Python**
   ```bash
   cd apple-interiors-converted
   python -m http.server 3000
   ```

3. **Using Live Server (VS Code)**
   - Install Live Server extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

## 📝 Customization

### Updating Content

1. **Portfolio Images**
   - Add images to `images/portfolio/[category]/`
   - Update `fallbackItems` array in `script.js`

2. **Contact Information**
   - Update contact details in `index.html` (Contact section and Footer)
   - Modify phone numbers, email, and address

3. **Services**
   - Edit the Services section in `index.html`
   - Update service titles, descriptions, and icons

4. **Testimonials**
   - Modify testimonial content in the HTML
   - Add/remove testimonial cards as needed

### Styling Changes

1. **Colors**
   - Update Tailwind config in `index.html` head section
   - Modify CSS variables in `styles.css`

2. **Fonts**
   - Change Google Fonts import in `index.html`
   - Update font family in Tailwind config

## 🎯 Performance Optimization

- **Images**: All images are optimized and use WebP format where possible
- **CSS**: Tailwind CSS loaded via CDN for faster loading
- **JavaScript**: Minimal vanilla JS for maximum performance
- **Caching**: Vercel automatically handles caching and CDN

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔍 SEO Features

- Complete meta tags (Open Graph, Twitter Cards)
- JSON-LD structured data
- Semantic HTML structure
- Optimized images with alt tags
- Fast loading times
- Mobile-friendly design

## 📞 Support

For technical support or customization requests, contact the development team.

## 📄 License

This project is proprietary to Apple Interiors. All rights reserved.

---

**Built with ❤️ for Apple Interiors - Best Interior Designers in Hyderabad**
