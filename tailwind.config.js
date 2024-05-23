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
        bgPrimary:"#f1f1f1"
      },
    },
  },
  plugins: [],
}

