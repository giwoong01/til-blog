import type { ColorMode } from "../styles/theme";

export {};

declare global {
  interface Window {
    Buffer?: typeof Buffer;
    __toggleColorMode?: () => void;
    __getColorMode?: () => "light" | "dark";
    __setColorMode?: (m: ColorMode) => void;
    __getColorModeRaw?: () => ColorMode;
  }
}
