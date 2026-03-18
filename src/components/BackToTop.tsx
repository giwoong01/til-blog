import { useEffect, useState } from "react";
import styled from "styled-components";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Btn
      type="button"
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      ↑
    </Btn>
  );
}

const Btn = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  &:hover {
    background: ${({ theme }) => theme.colors.chip};
  }
  ${({ theme }) => theme.mq.sm} {
    bottom: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;
