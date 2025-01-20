/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jost: ["Jost", "sans-serif"],
        "noto-sans": ["Noto Sans", "sans-serif"],
        crostan: ["Crostan", "sans-serif"],
        titillium: ["Titillium Web", "sans-serif"],
      },
    },
  },

  plugins: [],
};
