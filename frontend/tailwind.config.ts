import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ["var(--font-inter)", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
      colors: {
        "bg-primary":    "var(--bg-primary)",
        "accent-cyan":   "var(--accent-cyan)",
        "accent-blue":   "var(--accent-blue)",
        "text-primary":  "var(--text-primary)",
        "text-secondary":"var(--text-secondary)",
      },
      animation: {
        marquee: "marquee 60s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
