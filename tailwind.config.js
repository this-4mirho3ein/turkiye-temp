const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0545a4",
          light: "#1a4fa0",
        },
        secondary: {
          DEFAULT: "#ffb649",
          bronze: "#e78e08",
          light: "#ffbb69",
        },
        button: "#399766",
        light: "#555555",
        dark: "#333333",
        error: "#b40000",
        muted: "#f5f5f5", // Add the muted color here
        border: "#e5e7eb", // Add the border color here
        text: "#333333",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        float: "float 10s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
          "100%": { transform: "translateY(0px) rotate(0deg)" },
        },
      },
    },
  },
  plugins: [
    heroui(),
    function({ addUtilities }) {
      const newUtilities = {
        '.dir-ltr': {
          direction: 'ltr',
        },
        '.rtl': {
          direction: 'rtl',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
