// const { addDynamicIconSelectors } = require("@iconify/tailwind");
// const { iconsPlugin, getIconCollections } = require("@egoist/tailwindcss-icons");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [__dirname + "/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")],
  }
  
  