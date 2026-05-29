import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        surface: "#F0F6FF",
        "surface-end": "#F5F7FB",
        school: {
          DEFAULT: "#1A3088",
          dark: "#152A6E",
        },
        primary: {
          DEFAULT: "#2D68D7",
          hover: "#1A3088",
          light: "#EFF6FF",
        },
        ink: {
          DEFAULT: "#1E293B",
          muted: "#4B5563",
          subtle: "#94A3B8",
        },
        card: "#FFFFFF",
        border: "#E2E8F0",
        filter: {
          inactive: "#F1F5F9",
        },
        urgent: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
        accent: {
          green: "#10B981",
          "green-light": "#ECFDF5",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
        numeric: ["SUIT", "Pretendard", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(26, 48, 136, 0.08)",
        soft: "0 2px 12px rgba(15, 23, 42, 0.06)",
        menu: "0 2px 8px rgba(15, 23, 42, 0.1)",
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
      },
      maxWidth: {
        app: "480px",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, #F0F6FF 0%, #F5F7FB 100%)",
      },
    },
  },
};

export default config;
