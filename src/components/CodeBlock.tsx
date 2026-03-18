import { useState } from "react";
import styled from "styled-components";
import { CODE_COPY_FEEDBACK_DURATION } from "../constants";

type Props = {
  className?: string;
  children?: React.ReactNode;
  node?: unknown;
  inline?: boolean;
};

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props: Record<string, unknown> }).props;
    return getTextContent(props.children as React.ReactNode);
  }
  return "";
}

export default function CodeBlock({ className, children, inline }: Props) {
  const [copied, setCopied] = useState(false);

  if (inline) {
    return <code className={className}>{children}</code>;
  }

  const handleCopy = async () => {
    const text = getTextContent(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), CODE_COPY_FEEDBACK_DURATION);
    } catch {
      // ignore
    }
  };

  return (
    <Wrapper>
      <CopyButton type="button" onClick={handleCopy}>
        {copied ? "복사됨" : "복사"}
      </CopyButton>
      <code className={className}>{children}</code>
    </Wrapper>
  );
}

const Wrapper = styled.span`
  position: relative;
  display: block;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  font-size: 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.subtleText};
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 1;

  ${Wrapper}:hover & {
    opacity: 1;
  }
`;
