/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // or 'class' for manual dark mode
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)', 
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        'text-on-light': 'var(--text-on-light)',
        'text-on-dark': 'var(--text-on-dark)',
        'text-light-muted': 'var(--text-light-muted)',
        'text-dark-muted': 'var(--text-dark-muted)',
      },
      textColor: {
        'default': 'var(--foreground)',
        'inverse': 'var(--background)',
      },
      backgroundColor: {
        'default': 'var(--background)',
        'inverse': 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)'],
        serif: ['var(--font-playfair)'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [],
} 