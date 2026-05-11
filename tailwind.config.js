/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hintergrund-Toene (zartes Rose) - frueher "cream"
        cream: {
          50: "#fdfbfc",   // fast weiss mit Hauch rosa
          100: "#f9f3f7",  // sehr zart rosa
          200: "#f2ecf0",  // hellrosa-mauve (Hintergrund)
          300: "#e8dde5",  // tieferer Rosa-Hauch
        },
        // Mauve-Rosa Akzente - frueher "mauve"
        mauve: {
          400: "#c4a5bc",
          500: "#a885a0",  // Hauptakzent (Buttons, Highlights)
          600: "#95738e",
          700: "#7a5e75",  // mittleres Mauve fuer Text
          800: "#5e4a59",
        },
        // Warmes Aubergine fuer Text - frueher "cocoa"
        cocoa: {
          50: "#fdfbfc",
          100: "#f5e8f0",
          200: "#e6d0db",
          700: "#6b4a62",
          800: "#4e364a",
          900: "#382634",  // dunkler Text
        },
        // Warme Akzentfarbe (Pfirsich/Terra) fuer Buttons - frueher "terra"
        terra: {
          300: "#e8b8a8",
          400: "#d99e88",
          500: "#c87f63",  // Primary-Action-Color (Buttons)
          600: "#b06b50",
          700: "#8c543e",  // Fehler-Hinweise
        },
        // Honig-Goldton fuer besondere Hinweise - frueher "honey"
        honey: {
          400: "#e8c995",
          500: "#d4a868",
          600: "#b88a4a",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Fraunces", "serif"],
        body: ["Manrope", "Inter", "sans-serif"],
        script: ["Allura", "cursive"],
      },
      boxShadow: {
        soft: "0 4px 18px rgba(168, 133, 160, 0.18)",
        glow: "0 8px 24px rgba(200, 127, 99, 0.22)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
