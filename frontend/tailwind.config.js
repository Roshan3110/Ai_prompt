/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#161314",
          800: "#241f20",
          700: "#332b2c",
        },
        vellum: {
          50: "#faf7f0",
          100: "#f1ead9",
          200: "#e4d8bd",
        },
        brass: {
          400: "#c9a24b",
          500: "#a97e2f",
          600: "#8a6423",
        },
        moss: {
          500: "#4c6b52",
          600: "#3b5540",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,19,20,0.06), 0 8px 20px -12px rgba(22,19,20,0.25)",
      },
    },
  },
  plugins: [],
};
