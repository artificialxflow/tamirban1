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
      },
    },
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [],
};

export default config;

