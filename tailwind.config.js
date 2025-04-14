/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,jsx,ts,tsx}',  // Include JSX/TSX files for Tailwind to process
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/line-clamp')
    ],
  }
  