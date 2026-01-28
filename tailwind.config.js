/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'hv-blue': '#2563eb', 
      },
    },
  },
  plugins: [],
}