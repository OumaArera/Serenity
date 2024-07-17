/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'soft-blue': '#A3C6C4',
        'muted-green': '#B8D8B8',
        'light-beige': '#F2E2CE',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
