import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // This is what makes your theme toggle work!
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    colors: {
      background: "#0B0F19",
      card: "#111827",
      border: "#1F2937",
      primary: "#22C55E",
    },
  },
},
  plugins: [],
};
export default config;