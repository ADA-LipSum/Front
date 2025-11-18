import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "my-color": "#858E96",
    },
    extend: {},
  },
  plugins: [typography()],
};
