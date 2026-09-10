import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        command: {
          950: "#0b0f19",
          900: "#0f172a",
          850: "#131d35",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
        },
        hazard: {
          safe: "#10b981",       // Level 0
          low: "#06b6d4",        // Level 1
          medium: "#f59e0b",     // Level 2
          high: "#f97316",       // Level 3
          redzone: "#e11d48",    // Level 4
          critical: "#dc2626"
        },
      },
    },
  },
  plugins: [],
};
export default config;
