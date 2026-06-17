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
      // Canonical brand palette, matched to oakandsparrowsystemsenterprise.io
      // (forest green and gold). Sourced from the team's committed site assets.
      colors: {
        forest: {
          DEFAULT: "#1B4332", // --forest
          deep: "#0F2118", // dark panels (verdict pane, mini-ledger)
          mid: "#2D6A4F", // --forest-mid
          soft: "#E6F4EE", // --green-bg, light section background
        },
        gold: {
          DEFAULT: "#C9A84C", // --gold
          soft: "#E6CD7E", // lighter gold for text on dark
          deep: "#A8862F", // --gold-deep
        },
        parchment: "#FBFBF8", // --paper
        ink: "#16241D", // --ink, primary body text
        muted: "#5C6B63", // --muted
        line: "#D8E0DA", // --line, hairline borders
        verdict: {
          green: "#2D6A4F",
          yellow: "#C9A84C",
          red: "#B0301F",
          // brighter tints for verdict text/dots on dark backgrounds
          "green-on": "#7FD3AA",
          "yellow-on": "#E6CD7E",
          "red-on": "#FF9B8C",
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
