import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // <- important
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        wide: "1450px",
      },
    },
  },
  plugins: [],
};

export default config;