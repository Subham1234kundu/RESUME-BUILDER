/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        txtPrimary:"#555",
        txtLight:"#999",
        txtDark:"#222",
        bgPrimary:"#2f2f2f"
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}

