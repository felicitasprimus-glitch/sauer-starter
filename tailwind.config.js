/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hintergrund - sehr helles Champagne
        cream: {
          50: "#fdfcf7",   // off-white mit Hauch von Warm
          100: "#faf6ed",  // Champagne-Papier (Haupt-Hintergrund)
          200: "#f0e8d5",  // gedeckte Champagne
          300: "#e3d4ac",  // mehr Gold-Touch
        },
        // Akzentfarbe - tiefes Aubergine/Mauve (statt fad rosa)
        mauve: {
          400: "#a07c80",
          500: "#7d5560",  // Hauptakzent
          600: "#664047",
          700: "#4a2e34",
          800: "#2e1a1f",  // sehr dunkel - fuer Drama
        },
        // Text - dunkel und kraeftig
        cocoa: {
          50: "#fdfcf7",
          100: "#f5ebee",
          200: "#e8d6dc",
          700: "#4a3640",
          800: "#2a1d24",  // Haupttext - kraeftig
          900: "#1a0f14",  // fuer Headlines
        },
        // GOLD - die Hauptakzentfarbe
        gold: {
          100: "#f7eecf",
          200: "#ecdaa1",
          300: "#dec069",
          400: "#cba84d",  // Hauptgold
          500: "#b89238",  // Tiefes Gold (Buttons, wichtige Akzente)
          600: "#9a7a2c",
          700: "#7a6121",
        },
        // Terrakotta fuer warme Akzente
        terra: {
          400: "#c89e90",
          500: "#a67c7d",
          600: "#8d6566",
          700: "#6e4a4e",
        },
        honey: {
          400: "#d4b380",
          500: "#c9a063",
          600: "#a8814a",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Inter"', '"Helvetica Neue"', "sans-serif"],
        script: ["Allura", "cursive"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 8vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2rem, 6vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 4vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        mini: ["10px", { lineHeight: "1.4", letterSpacing: "0.25em" }],
      },
      boxShadow: {
        soft: "0 1px 4px rgba(74, 46, 52, 0.06)",
        glow: "0 4px 28px rgba(184, 146, 56, 0.18)",
        editorial: "0 1px 2px rgba(58, 42, 53, 0.04), 0 12px 40px rgba(58, 42, 53, 0.06)",
        gold: "0 4px 16px rgba(184, 146, 56, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
