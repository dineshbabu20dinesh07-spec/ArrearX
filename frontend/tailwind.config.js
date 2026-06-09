/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",    // Neon Indigo
        secondary: "#d946ef",  // Neon Pink
        cyan: "#22d3ee",       // Neon Cyan
        emerald: "#10b981",    // Neon Green
        background: "#08080c", // Deep Space Black
        surface: "#11111a",    // Cyber Surface
        border: "#202030"      // Glass Border
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "neon": "0 0 20px rgba(99, 102, 241, 0.4)",
        "neon-cyan": "0 0 20px rgba(34, 211, 238, 0.4)",
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #6366f1 0%, #d946ef 100%)',
      }
    },
  },
  plugins: [],
}
