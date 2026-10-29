import type { Config } from "tailwindcss";

// Brand tokens taken from the NOAH LEGAL logo and the Iteration 1 designs.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#16213D", // logo navy
          800: "#242F4D", // raised navy surface / image placeholders
        },
        gold: {
          DEFAULT: "#C9A85B", // logo gold — accents on navy only
          ink: "#7A5A2B", // gold for text on light grounds (AA contrast)
        },
        ivory: "#F5F3EF", // page ground
        sand: "#EAE6DF", // alternate light band
        line: "#C9C2B6", // hairlines on sand
        stone: "#DCD6CC", // image placeholders on light
        muted: {
          DEFAULT: "#4A5165", // body text on light
          light: "#C6CBD8", // body text on navy
          lighter: "#A9B0C3", // meta text on navy
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
      letterSpacing: {
        eyebrow: "0.24em",
      },
    },
  },
  plugins: [],
};

export default config;
