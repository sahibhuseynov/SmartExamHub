/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Poppins', 'sans-serif'], // Varsayılan sans-serif ailesi olarak Poppins
    },
  },
  plugins: [require("daisyui")], // DaisyUI eklendi

};
