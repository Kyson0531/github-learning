import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0A0C10",
          900: "#10141C",
          800: "#161B26",
          700: "#1E2533",
        },
        mist: {
          100: "#F2F4F7",
          200: "#D5DAE3",
          300: "#8A93A3",
          400: "#6B7384",
        },
        fiber: {
          cyan: "#5EEAD4",
          blue: "#7EB6FF",
          violet: "#A78BFA",
          amber: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        editorial: "0.08em",
      },
    },
  },
  plugins: [],
};

export default config;
