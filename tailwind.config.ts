import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <- important
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0f1418",
          accent: "#d2a852",
        },
      },
    },
  },
  plugins: [],
};

export default config;