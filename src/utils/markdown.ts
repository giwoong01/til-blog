import type { ReactNode } from "react";

export const HEADER_OFFSET = 140;

export const slugify = (text: string): string => {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base;
};

export const getTextFromChildren = (children: ReactNode): string => {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children))
    return children.map(getTextFromChildren).join("");
  if (children && typeof children === "object" && "props" in children)
    return getTextFromChildren(
      (children as { props: { children: ReactNode } }).props.children
    );
  return "";
};
