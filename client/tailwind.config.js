/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0D2D6B",
        navyLight: "#1a4299",
        accent: "#3B8BD4",
        bg: "#F5F6FA",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0D2D6B, #1a4299)",
      },
    },
  },
  plugins: [],
};
