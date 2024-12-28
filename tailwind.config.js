/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'fluid': 'clamp(1.5rem, 5vw, 7rem)',
      },
      width: {
        'responsive': 'clamp(10rem, 25vw, 45rem)',
      },
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'], // Varsayılan sans-serif ailesi olarak Poppins
    },
  },
  plugins: [require("daisyui")], // DaisyUI eklendi

};
