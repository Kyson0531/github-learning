import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: "#F5F5F7",
          surface: "#FFFFFF",
          ink: "#1D1D1F",
          secondary: "#6E6E73",
          blue: "#0071E3",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Segoe UI"',
          '"PingFang SC"',
          '"Noto Sans SC"',
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      maxWidth: {
        content: "1080px",
        hero: "720px",
      },
      letterSpacing: {
        editorial: "0.06em",
      },
      boxShadow: {
        soft: "0 2px 16px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
