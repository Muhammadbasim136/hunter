/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F1512",
        surface: "#171F1B",
        "surface-raised": "#1D2721",
        hairline: "#2A342F",
        brass: {
          DEFAULT: "#E3A857",
          dim: "#8A6B3C",
          bright: "#F0BE72",
        },
        signal: {
          DEFAULT: "#5FAE87",
          dim: "#3E7259",
          bright: "#7BCBA3",
        },
        alert: {
          DEFAULT: "#D9634B",
          dim: "#8F4030",
          bright: "#F07E5F",
        },
        ink: {
          DEFAULT: "#EDEDE6",
          muted: "#8A9490",
          faint: "#5C6763",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.5)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.7" },
          "70%": { transform: "scale(1.9)", opacity: "0" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
        "highlight-pulse": {
          "0%": { backgroundColor: "rgba(227,168,87,0.22)" },
          "100%": { backgroundColor: "rgba(227,168,87,0)" },
        },
        "alert-wave": {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite",
        "highlight-pulse": "highlight-pulse 1.8s ease-out",
        "alert-wave": "alert-wave 0.9s ease-in-out infinite",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
