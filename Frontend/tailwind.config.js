/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Scan all JS/TS/React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
