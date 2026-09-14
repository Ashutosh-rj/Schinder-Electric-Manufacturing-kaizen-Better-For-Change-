/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#2a3a5c",
        input: "#2a3a5c",
        ring: "#00d4ff",
        background: "#0a0e1a",
        foreground: "#e8eaf6",
        primary: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0e1a",
        },
        secondary: {
          DEFAULT: "#8899aa",
          foreground: "#0a0e1a",
        },
        destructive: {
          DEFAULT: "#ef5350",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#141e35",
          foreground: "#8899aa",
        },
        accent: {
          DEFAULT: "#00d4ff",
          foreground: "#0a0e1a",
        },
        popover: {
          DEFAULT: "#1a2540",
          foreground: "#e8eaf6",
        },
        card: {
          DEFAULT: "#1a2540",
          foreground: "#e8eaf6",
        },
        success: "#00e676",
        warning: "#ffa726",
        danger: "#ef5350",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}