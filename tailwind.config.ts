import type { Config } from "tailwindcss";

// Brand: forest green and gold, Georgia serif, generous white space,
// architectural not illustrative. Verdict palette is locked to GREEN/YELLOW/RED.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1c3d2e",
          deep: "#102419",
          mid: "#2f5d45",
          soft: "#e8efe9",
        },
        gold: {
          DEFAULT: "#c2a14d",
          soft: "#e9dcb6",
          deep: "#9a7e36",
        },
        parchment: "#fbfaf5",
        verdict: {
          green: "#1c7c4a",
          yellow: "#c2900f",
          red: "#b23232",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
