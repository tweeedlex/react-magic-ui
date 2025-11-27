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
        positive: "var(--color-positive)",
        negative: "var(--color-negative)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
        neutral: "var(--color-neutral)",
        gradient: "var(--color-gradient)",
      }
    },
  },
  plugins: [],
}

