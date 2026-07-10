/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eefbff",
          100: "#d6f3ff",
          200: "#b0e8ff",
          300: "#77d9ff",
          400: "#33c3ff",
          500: "#0aa8f0",
          600: "#0086cc",
          700: "#0069a3",
          800: "#075985",
          900: "#0c4a6e",
        },
        sunset: {
          400: "#ff9d6c",
          500: "#ff7a45",
          600: "#f4602a",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
      },
      fontFamily: {
        display: ["Poppins", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(15, 45, 60, 0.15)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0aa8f0 0%, #14b8a6 50%, #ff7a45 100%)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
