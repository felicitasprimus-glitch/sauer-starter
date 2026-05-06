/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sauer macht Krustig palette
        cream: {
          50: "#FDFAF4",
          100: "#FAF6F0",
          200: "#F3EBDD",
        },
        mauve: {
          400: "#B8869B",
          500: "#9D6B7E",
          600: "#7E5366",
          700: "#5E3D4D",
        },
        terra: {
          400: "#D89578",
          500: "#C97B5B",
          600: "#B5654A",
          700: "#8E4D38",
        },
        honey: {
          400: "#E8B547",
          500: "#D4A04C",
          600: "#B4842F",
        },
        cocoa: {
          700: "#5C4232",
          800: "#3D2A20",
          900: "#28190F",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(93, 61, 77, 0.08), 0 4px 24px -4px rgba(93, 61, 77, 0.06)",
        warm: "0 4px 16px -4px rgba(201, 123, 91, 0.18)",
      },
      animation: {
        "rise": "rise 0.5s ease-out",
        "bubble": "bubble 3s ease-in-out infinite",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bubble: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-4px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
