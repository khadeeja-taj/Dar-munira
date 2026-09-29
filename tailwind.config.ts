import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette extracted from the Dar Al-Munirah mark + IIUI emerald
        ink: "#14110F",
        emerald: {
          DEFAULT: "#0B5D3B",
          deep: "#0B3D28",
          soft: "#0A4A30",
        },
        leaf: "#7FBF3F",
        teal: {
          DEFAULT: "#16788F",
          light: "#4FC3D9",
        },
        beige: "#F1F5EF",
        sand: "#F7F8F4",
        cloud: "#FBFCFA",
        // Semantic aliases
        brand: {
          DEFAULT: "#0B5D3B",
          fg: "#0B3D28",
          accent: "#7FBF3F",
          muted: "#5E7268",
        },
      },
      fontFamily: {
        display: ["var(--font-marcellus)", "Marcellus", "serif"],
        sans: ["var(--font-manrope)", "Manrope", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "Noto Sans Arabic", "sans-serif"],
        kufi: ["var(--font-arabic)", "Noto Sans Arabic", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glass: "0 10px 30px rgba(11,61,40,.08)",
        "glass-lg": "0 20px 60px rgba(11,61,40,.14)",
        card: "0 6px 24px rgba(11,61,40,.06)",
        glow: "0 8px 30px rgba(127,191,63,.35)",
      },
      backdropBlur: {
        glass: "14px",
      },
      keyframes: {
        floatUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        floatY: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        floatUp: "floatUp .7s ease both",
        floatY: "floatY 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        fadeIn: "fadeIn .5s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
