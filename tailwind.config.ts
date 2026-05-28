import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        surface: "#F5F7FB",
        primary: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
          light: "#EFF6FF",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        card: "#FFFFFF",
        border: "#E2E8F0",
        urgent: {
          DEFAULT: "#EF4444",
          light: "#FEF2F2",
        },
        completed: {
          DEFAULT: "#64748B",
          light: "#F1F5F9",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
        numeric: ["SUIT", "Pretendard", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(15, 23, 42, 0.06)",
        header: "0 1px 0 rgba(226, 232, 240, 0.8)",
      },
      borderRadius: {
        card: "16px",
        pill: "9999px",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
};

export default config;
