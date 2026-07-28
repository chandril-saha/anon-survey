/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "silk-flow": "silk-flow 25s ease-in-out infinite alternate",
        "silk-flow-reverse": "silk-flow-reverse 30s ease-in-out infinite alternate",
        "silk-flow-slow": "silk-flow 40s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "silk-flow": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(15%, 15%) scale(1.1)" },
          "66%": { transform: "translate(-10%, 20%) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "silk-flow-reverse": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-15%, -15%) scale(1.05)" },
          "66%": { transform: "translate(20%, -10%) scale(1.15)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      }
    },
  },
  plugins: [],
}
