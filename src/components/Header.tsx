import styled from "styled-components";
import { Link } from "react-router-dom";
import { profile } from "../profile";
import { useEffect, useState } from "react";

export default function Header() {
  const [mode, setMode] = useState<string>(
    () =>
      (
        window as unknown as { __getColorModeRaw?: () => string }
      ).__getColorModeRaw?.() ||
      (
        window as unknown as { __getColorMode?: () => string }
      ).__getColorMode?.() ||
      "light"
  );

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | undefined;
      if (detail) setMode(detail);
    };
    window.addEventListener("color-mode", handler as EventListener);
    return () =>
      window.removeEventListener("color-mode", handler as EventListener);
  }, []);

  const isDark = mode === "dark";

  return (
    <Wrap>
      <BrandLink to="/">
        <BrandText>Today I Learned</BrandText>
        <BrandTextShort>TIL</BrandTextShort>
      </BrandLink>
      <Right>
        <TopLink to="/archive">
          <LinkText>아카이브</LinkText>
          <LinkIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
          </LinkIcon>
        </TopLink>
        <TopLinkExternal href="/portfolio/" target="_blank" rel="noreferrer">
          <LinkText>포트폴리오</LinkText>
          <LinkIcon viewBox="0 0 24 24" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </LinkIcon>
        </TopLinkExternal>
        {profile.github && (
          <IconLink
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Icon viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.93.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05.8-.23 1.66-.35 2.51-.35.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.95-2.33 4.82-4.56 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
            </Icon>
          </IconLink>
        )}
        <Switch
          role="switch"
          aria-label="Toggle theme"
          aria-checked={isDark}
          $dark={isDark}
          onClick={() =>
            (
              window as unknown as { __toggleColorMode?: () => void }
            ).__toggleColorMode?.()
          }
        >
          <IconWrap data-active={String(!isDark)}>
            <SunIcon viewBox="0 0 24 24" aria-hidden>
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM12 4V1h0v3h0zm0 19v-3h0v3h0zM4 12H1v0h3v0zm19 0h-3v0h3v0zM6.76 19.16l-1.42 1.42-1.79-1.8 1.41-1.41 1.8 1.79zM17.24 4.84l1.4-1.4 1.8 1.79-1.41 1.41-1.79-1.8zM12 7a5 5 0 100 10 5 5 0 000-10z" />
            </SunIcon>
          </IconWrap>
          <Knob $dark={isDark} />
          <IconWrap data-active={String(isDark)}>
            <MoonIcon viewBox="0 0 24 24" aria-hidden>
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </MoonIcon>
          </IconWrap>
        </Switch>
      </Right>
    </Wrap>
  );
}

const BrandLink = styled(Link)`
  font-weight: 800;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  flex: 1 1 auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ theme }) => theme.mq.sm} {
    font-size: 16px;
  }
`;

const BrandText = styled.span`
  ${({ theme }) => theme.mq.sm} {
    display: none;
  }
`;

const BrandTextShort = styled.span`
  display: none;
  ${({ theme }) => theme.mq.sm} {
    display: inline;
  }
`;

const Wrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  ${({ theme }) => theme.mq.sm} {
    gap: 8px;
    padding: 8px 10px;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  ${({ theme }) => theme.mq.sm} {
    gap: 6px;
  }
`;
const TopLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border: 1px solid
    ${({ theme }) => (theme.mode === "dark" ? "#3b455a" : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  &:hover {
    background: ${({ theme }) => theme.colors.chip};
  }
  ${({ theme }) => theme.mq.sm} {
    height: 24px;
    padding: 0 6px;
    font-size: 11px;
  }
`;

const LinkText = styled.span`
  ${({ theme }) => theme.mq.sm} {
    display: none;
  }
`;

const LinkIcon = styled.svg`
  display: none;
  width: 16px;
  height: 16px;
  fill: currentColor;
  ${({ theme }) => theme.mq.sm} {
    display: block;
  }
`;

const TopLinkExternal = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border: 1px solid
    ${({ theme }) => (theme.mode === "dark" ? "#3b455a" : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  &:hover {
    background: ${({ theme }) => theme.colors.chip};
  }
  ${({ theme }) => theme.mq.sm} {
    height: 24px;
    padding: 0 6px;
    font-size: 11px;
  }
`;

const IconLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid
    ${({ theme }) => (theme.mode === "dark" ? "#3b455a" : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.surface};
  &:hover {
    background: ${({ theme }) => theme.colors.chip};
  }
  ${({ theme }) => theme.mq.sm} {
    width: 24px;
    height: 24px;
  }
`;

const Icon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
  ${({ theme }) => theme.mq.sm} {
    width: 14px;
    height: 14px;
  }
`;

const Switch = styled.button<{ $dark: boolean }>`
  position: relative;
  width: 64px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid
    ${({ theme }) => (theme.mode === "dark" ? "#3b455a" : theme.colors.border)};
  background: ${({ theme, $dark }) =>
    $dark ? theme.colors.chip : theme.colors.surface};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  transition: background 0.2s ease;
  ${({ theme }) => theme.mq.sm} {
    width: 56px;
    height: 26px;
    padding: 0 6px;
  }
`;

const Knob = styled.span<{ $dark: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.knobBg};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transform: ${({ $dark }: { $dark: boolean }) =>
    $dark ? "translateX(34px)" : "translateX(0)"};
  transition: transform 0.2s ease;
  ${({ theme }) => theme.mq.sm} {
    width: 20px;
    height: 20px;
    transform: ${({ $dark }: { $dark: boolean }) =>
      $dark ? "translateX(30px)" : "translateX(0)"};
  }
`;

const SunIcon = styled.svg`
  width: 16px;
  height: 16px;
  fill: currentColor;
  ${({ theme }) => theme.mq.sm} {
    width: 14px;
    height: 14px;
  }
`;
const MoonIcon = styled(SunIcon)``;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.subtleText};
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.chip};
    color: ${({ theme }) => theme.colors.text};
  }
  ${({ theme }) => theme.mq.sm} {
    width: 18px;
    height: 18px;
  }
`;
