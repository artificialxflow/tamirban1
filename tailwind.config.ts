import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./docs/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        yekan: ["var(--font-yekan)", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        accent: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        warm: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "1.5rem",
          lg: "2rem",
        },
        screens: {
          "2xl": "1280px",
        },
      },
      boxShadow: {
        soft: "0px 16px 56px rgba(16, 24, 40, 0.08)",
        "soft-primary": "0px 16px 56px rgba(59, 130, 246, 0.12)",
        "soft-accent": "0px 16px 56px rgba(34, 197, 94, 0.12)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        "gradient-accent": "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
        "gradient-warm": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [],
};

export default config;

