/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./api/**/*.js",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#eab308", // Apple Interiors Yellow
        "primary-hover": "#ca8a04",
        "primary-light": "#fef08a",
        "primary-dark": "#a16207",
        secondary: "#1f2937", // Charcoal
        accent: "#111827", // Deep Black/Gray
        muted: "#f3f4f6", // Light Gray
        foreground: "#374151", // Text Color
        background: "#ffffff" // Clean White Background
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};
