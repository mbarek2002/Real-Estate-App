/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: '#3742FA',
        secondaryColor : '#96979B',
        btnColor:"#3742FA"
      },
      animation: {
        spin360: 'spin360 0.5s ',
      },
      keyframes: {
        spin360: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      borderRadius: {
        '4xl': '4rem', 
        't-4xl': '4rem',
      },
    },
  },
  plugins: [],
}

