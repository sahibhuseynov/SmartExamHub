/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      translate: {
        '-35': '-35%',
      },
      backgroundImage: {
        'custom-pattern':
          'radial-gradient(circle at center center, #444cf7, #e5e5f7), repeating-radial-gradient(circle at center center, #444cf7, #444cf7 18px, transparent 36px, transparent 18px)',
      },
      backgroundBlendMode: {
        multiply: 'multiply',
      },
      fontSize: {
        'fluid': 'clamp(1.5rem, 5vw, 7rem)',
      },
      width: {
        'responsive': 'clamp(10rem, 25vw, 100%)',
      },
      
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'], // Varsayılan sans-serif ailesi olarak Poppins
    },
  },
  plugins: [require("daisyui")], // DaisyUI eklendi

};
