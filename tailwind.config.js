/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hintergrund - off-white champagne wie Buchpapier
        cream: {
          50: "#fdfcfa",   // fast wei\u00df, warm
          100: "#faf8f4",  // off-white champagne (Haupt-Hintergrund)
          200: "#f4f0e8",  // cremiges Beige fuer Karten
          300: "#ebe5db",  // tieferes Beige fuer Borders/Hovers
        },
        // Hauptakzent - warmes Rosenholz/Mauve
        mauve: {
          400: "#b89394",  // helles Rosenholz
          500: "#a67c7d",  // Hauptakzent
          600: "#8d6566",  // dunkleres Mauve
          700: "#7d5560",  // Buttons (primary action)
          800: "#5e3e47",  // dunkle Akzente
        },
        // Text-Farben - warmes Aubergine
        cocoa: {
          50: "#fdfcfa",
          100: "#f5ebee",
          200: "#e8d6dc",
          700: "#5e4452",
          800: "#3a2a35",  // Haupttext
          900: "#221a20",  // Headlines/dunkler Text
        },
        // Sekund\u00e4r-Akzent - warmes Terrakotta
        terra: {
          300: "#d8b8ad",
          400: "#c89e90",
          500: "#a67c7d",  // f\u00fcr Highlights
          600: "#8d6566",
          700: "#6e4a4e",
        },
        // Gold/Honig f\u00fcr besondere Hinweise
        honey: {
          400: "#d4b380",
          500: "#c9a063",  // dezenter Gold-Ton
          600: "#a8814a",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Inter"', '"Helvetica Neue"', "sans-serif"],
        script: ["Allura", "cursive"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(58, 42, 53, 0.06)",
        glow: "0 4px 24px rgba(166, 124, 125, 0.18)",
        editorial: "0 1px 2px rgba(58, 42, 53, 0.04), 0 8px 32px rgba(58, 42, 53, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
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
