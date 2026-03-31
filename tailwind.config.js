/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        italianno: ['Italianno', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        pdh: ['Ownglyph_ParkDaHyun', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
