import styled from "styled-components";
import { profile } from "../profile";

export default function Footer() {
  const startYear = 2025;
  const thisYear = new Date().getFullYear();
  const yearText =
    startYear === thisYear ? `${thisYear}` : `${startYear}–${thisYear}`;
  return (
    <Wrap>
      <Small>
        © {yearText} {profile.name} · Made by {profile.name}
      </Small>
      <Right>
        {profile.email && (
          <EmailLink href={`mailto:${profile.email}`}>
            {profile.email}
          </EmailLink>
        )}
      </Right>
    </Wrap>
  );
}

const Wrap = styled.footer`
  color: ${({ theme }) => theme.colors.subtleText};
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Small = styled.span``;

const Right = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const EmailLink = styled.a`
  color: ${({ theme }) => theme.colors.subtleText};
  text-decoration: none;
`;
