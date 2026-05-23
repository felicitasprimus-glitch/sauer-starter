/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hintergruende - Creme & Sand (warm, hell)
        cream: {
          50: "#fffdfb",
          100: "#faf4ee", // Creme - Haupt-Hintergrund
          200: "#f2e9dc",
          300: "#e8dfc9", // Sand
        },
        // Akzent - Mauve (mittlerer Rose-Ton, exakt aus dem Prototyp)
        mauve: {
          400: "#a98c99",
          500: "#8b6a7d", // Mauve - Hauptakzent
          600: "#6e5266",
          700: "#4a3447",
          800: "#382836",
        },
        // Dunkel - Brombeer & Text
        cocoa: {
          50: "#fbf7f4",
          100: "#f3e9ec",
          200: "#e4d2d9",
          700: "#6b4f61",
          800: "#3e2c39", // Haupttext (ink)
          900: "#5a3f56", // Brombeer - Primaer-Buttons & aktive Elemente
        },
        // "Gold" umgedeutet zu sanftem Rose
        gold: {
          100: "#f6e9ec",
          200: "#ebd3da",
          300: "#ddbcc6",
          400: "#cba3b2",
          500: "#b5879a",
          600: "#9a6e82",
          700: "#7d5668",
        },
        terra: {
          400: "#c8a6ae",
          500: "#b08c97",
          600: "#977380",
          700: "#6e5161",
        },
        honey: {
          400: "#e0d2b4",
          500: "#d6c29b",
          600: "#bba47c",
        },
        // Flache Marken-Tokens (Prototyp) - fuer neue Bausteine
        altrosa: "#ddbcc6",
        sand: "#e8dfc9",
        brombeer: "#5a3f56",
        ink: "#3e2c39",
        muted: "#9a8290",
        line: "#ece0e6",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
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
        soft: "0 1px 4px rgba(90, 63, 86, 0.06)",
        glow: "0 4px 28px rgba(136, 106, 125, 0.18)",
        editorial: "0 1px 2px rgba(74, 48, 67, 0.04), 0 12px 40px rgba(74, 48, 67, 0.07)",
        card: "0 8px 24px rgba(123, 90, 110, 0.10)",
        gold: "0 4px 16px rgba(203, 163, 178, 0.28)",
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
