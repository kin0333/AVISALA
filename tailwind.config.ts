import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./entrypoints/**/*.{ts,tsx,html}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-green": "#39FF14",
        "neon-green-dim": "#22c55e",
        "dark-bg": "#0f0f0f",
        "dark-card": "#1a1a1a",
        "dark-border": "#2a2a2a",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "chip": "0 2px 12px rgba(0,0,0,0.6)",
      },
      animation: {
        "squeeze-in": "squeezeIn 0.2s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "pulse-neon": "pulseNeon 1.5s ease-in-out infinite",
      },
      keyframes: {
        squeezeIn: {
          "0%": { opacity: "0", transform: "scale(0.85) translateY(4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        pulseNeon: {
          "0%, 100%": { textShadow: "0 0 8px #39FF14, 0 0 20px #39FF14" },
          "50%": { textShadow: "0 0 4px #39FF14" },
        },
      },
    },
  },
  plugins: [],
}

export default config
