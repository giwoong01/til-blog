export type ColorMode = "light" | "dark" | "auto";

export type AppTheme = {
  mode: "light" | "dark";
  colors: {
    bg: string;
    text: string;
    subtleText: string;
    border: string;
    surface: string;
    chip: string;
    knobBg: string;
    codeBg: string;
    codeText: string;
  };
  radius: {
    sm: string;
    md: string;
  };
  shadow: {
    sm: string;
  };
  layout: {
    maxWidth: string;
    gutter: string;
  };
  mq: {
    sm: string;
    md: string;
  };
};

const common = {
  radius: {
    sm: "8px",
    md: "12px",
  },
  shadow: {
    sm: "0 6px 18px rgba(12, 18, 28, 0.06)",
  },
  layout: {
    maxWidth: "1200px",
    gutter: "16px",
  },
  mq: {
    sm: "@media (max-width: 640px)",
    md: "@media (max-width: 1200px)",
  },
};

export const lightTheme: AppTheme = {
  mode: "light",
  colors: {
    bg: "#f8fafc",
    text: "#0b1220",
    subtleText: "#6b7280",
    border: "#e5e8eb",
    surface: "#ffffff",
    chip: "#f2f5fa",
    knobBg: "#ffffff",
    codeBg: "#f3f4f6",
    codeText: "#0b1220",
  },
  ...common,
};

export const darkTheme: AppTheme = {
  mode: "dark",
  colors: {
    bg: "#0b1220",
    text: "#f3f4f6",
    subtleText: "#9aa3b2",
    border: "#1f2937",
    surface: "#111827",
    chip: "#1f2530",
    knobBg: "#0b1220",
    codeBg: "#0f172a",
    codeText: "#e5e7eb",
  },
  ...common,
};

// Backward compatibility default
export const theme = lightTheme;
