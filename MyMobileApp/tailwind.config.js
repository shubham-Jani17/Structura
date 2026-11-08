/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        structura: {
          navy: '#172B4D',
          navyDark: '#091E42',
          navyLight: '#253858',
          orange: '#F97316',
          orangeDark: '#EA580C',
          orangeLight: '#FFF7ED',
          muted: '#6B778C',
          bg: '#F4F6F9',
          lightGrey: '#F4F6F9',
          surface: '#F8FAFC',
          border: '#E2E8F0',
          borderLight: '#EDF2F7',
          borderDark: '#CBD5E1',
          slate: '#4B556D',
          success: '#36B37E',
          successLight: '#E3FCEF',
          warning: '#FFAB00',
          warningLight: '#FFFAE6',
          danger: '#FF5630',
          dangerLight: '#FFEBE6',
        },
      },
    },
  },
  plugins: [],
};
