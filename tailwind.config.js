/** @type {import('tailwindcss').Config} */
// export default {
//   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};
