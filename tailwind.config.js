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
          DEFAULT: '#EAB308', // Yellow
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
          950: '#422006'
        },
        secondary: {
          DEFAULT: '#1E293B', // Dark blue/black
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617'
        },
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
        montserrat: ['var(--font-montserrat)'],
        playfair: ['var(--font-playfair)'],
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