import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        "ink-soft": "#3e4a5c",
        mist: "#f6f4ef",
        porcelain: "#fbfaf7",
        brass: "#b88a44",
        spruce: "#28554d",
        "spruce-soft": "#dfece8",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 33, 47, 0.08)",
        card: "0 10px 30px rgba(24, 33, 47, 0.07)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
