import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: ${({ theme }) =>
    theme.mode === "dark" ? "dark" : "light"}; }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    line-height: 1.6;
  }
  a { color: inherit; }
  h1 { font-size: 40px; margin: 20px 0 12px; }
  h2 { font-size: 28px; margin: 18px 0 10px; }
  h3 { font-size: 20px; margin: 14px 0 8px; }
  p { margin: 0 0 12px; }
`;
