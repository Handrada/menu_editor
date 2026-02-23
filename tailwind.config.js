/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mexicanPink: '#ec4899',
        mexicanCyan: '#22d3ee',
      }
    },
  },
  plugins: [],
}