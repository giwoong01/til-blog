import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useEffect, useMemo, useState } from "react";
import App from "./App.tsx";
import { Buffer } from "buffer";
import { lightTheme, darkTheme, type ColorMode } from "./styles/theme";
import { GlobalStyle } from "./styles/global";

declare global {
  interface Window {
    Buffer?: typeof Buffer;
    __toggleColorMode?: () => void;
    __getColorMode?: () => "light" | "dark";
    __setColorMode?: (m: ColorMode) => void;
    __getColorModeRaw?: () => ColorMode;
  }
}

if (!window.Buffer) {
  window.Buffer = Buffer;
}

export function Root() {
  const [mode, setMode] = useState<ColorMode>(() => {
    const saved = localStorage.getItem("color-mode") as ColorMode | null;
    if (saved) return saved;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    localStorage.setItem("color-mode", mode);
  }, [mode]);

  const systemDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const effectiveMode =
    mode === "auto" ? (systemDark ? "dark" : "light") : mode;
  const theme = useMemo(
    () => (effectiveMode === "dark" ? darkTheme : lightTheme),
    [effectiveMode]
  );

  window.__toggleColorMode = () =>
    setMode((m) => (m === "dark" ? "light" : "dark"));
  window.__getColorMode = () => effectiveMode;
  window.__setColorMode = (m) => setMode(m);
  window.__getColorModeRaw = () => mode;

  useEffect(() => {
    const event = new CustomEvent("color-mode", { detail: effectiveMode });
    window.dispatchEvent(event);
    document.documentElement.setAttribute("data-color-mode", effectiveMode);
  }, [effectiveMode]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(<Root />);
