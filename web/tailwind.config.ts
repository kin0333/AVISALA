import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "neon-green": "#39FF14",
        "dark-bg": "#0f0f0f",
        "dark-card": "#1a1a1a",
        "dark-border": "#2a2a2a",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      keyframes: {
        squeezeIn: {
          "0%": { opacity: "0", transform: "scale(0.85) translateY(4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "squeeze-in": "squeezeIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
    },
  },
  plugins: [],
}

export default config
