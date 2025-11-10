/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        danger: "var(--color-danger)",
        link: "var(--color-link)",
        default: "var(--color-default)",
        gradient: "var(--color-gradient)",
      }
    },
  },
  plugins: [],
  safelist: [
    "flex-row",
    "flex-col",
    "items-start",
    "items-center",
    "items-end",
    "justify-start",
    "justify-center",
    "justify-end",
    "justify-between",
    "justify-around",
    "bg-danger",
    "bg-link",
    "bg-default"
  ],
}

