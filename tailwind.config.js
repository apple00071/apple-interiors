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
        primary: "#eab308",
        "primary-hover": "#ca8a04",
        "primary-light": "#fef9c3",
        "primary-dark": "#854d0e",
        secondary: "#1e293b",
        accent: "#f8fafc",
        muted: "#f1f5f9",
        foreground: "#0f172a",
        background: "#ffffff"
      },
      fontFamily: {
        sans: ["Montserrat", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};
