# Apple Interiors Website

A modern, responsive website for Apple Interiors, a premium interior design company. Built with Next.js, React, TypeScript, and TailwindCSS.

![Apple Interiors](https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1080)

## Features

- Responsive design that works on all devices
- Modern UI with smooth animations using Framer Motion
- Interactive components for better user engagement
- Contact form with validation
- Project gallery with filtering capabilities
- Optimized for performance and SEO

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- TailwindCSS 4
- Framer Motion
- Heroicons

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/apple-interiors.git
   cd apple-interiors
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Building for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

Then, you can start the production server:

```bash
npm start
# or
yarn start
```

## Project Structure

- `src/app/`: Main application code
  - `components/`: Reusable React components
  - `page.tsx`: Main page component
  - `layout.tsx`: Root layout component
  - `globals.css`: Global styles

## Customization

The website is designed to be easily customizable:

- Colors: Edit the CSS variables in `src/app/globals.css`
- Fonts: Change the font imports in `src/app/layout.tsx`
- Content: Update the text and images in each component
- Sections: Add, remove, or rearrange sections in `src/app/page.tsx`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Images from [Unsplash](https://unsplash.com/)
- Icons from [Heroicons](https://heroicons.com/)
