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
      // Light-blue brand scheme, matched to the Gatekeeper page: cream paper,
      // near-black ink headlines, a single muted slate-blue accent. Navy is the
      // dark anchor for the governance panel and footer.
      colors: {
        paper: {
          DEFAULT: "#F4F1EA", // cream page background
          cool: "#EAF0F3", // faint cool band for section rhythm
        },
        white: "#FFFFFF",
        ink: {
          DEFAULT: "#1A1A1A", // headlines + primary text
          soft: "#3A4148",
        },
        muted: {
          DEFAULT: "#56606A", // secondary text
          soft: "#7A828B",
        },
        line: "#E2E0D7", // hairline borders
        navy: {
          DEFAULT: "#243240", // dark sections / panels
          deep: "#1A2530",
          soft: "#2E3F4F",
        },
        blue: {
          DEFAULT: "#6F90A8", // the slate-blue accent
          deep: "#557791", // hover / darker accent on light
          soft: "#AFC6D6", // light tint
          on: "#9FBDD2", // accent text on navy
        },
        // Verdict palette — the product's signal, kept distinct and legible on
        // both the cream/white light surfaces and the navy dark panel.
        verdict: {
          green: "#2D6A4F",
          yellow: "#B07D1E",
          red: "#B0301F",
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
