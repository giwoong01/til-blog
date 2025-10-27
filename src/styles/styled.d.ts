import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
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
    syntax: {
      keyword: string;
      string: string;
      number: string;
      title: string;
      type: string;
      meta: string;
      comment: string;
    };
  }
}
