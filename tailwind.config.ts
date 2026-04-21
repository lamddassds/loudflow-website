import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0a0912",
          900: "#0f0e18",
          800: "#17151f",
          700: "#1f1d2a",
          600: "#2a2838",
        },
        brand: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(139,92,246,0.18), transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
