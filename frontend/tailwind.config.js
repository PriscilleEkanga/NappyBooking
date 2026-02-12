/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: '#B37256',
        nappyBlack: '#1A1A1A',
        nappyCream: '#FAF9F6',
      },
    },
  },
  plugins: [],
}