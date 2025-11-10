import styled from "styled-components";
import { HEADER_OFFSET } from "../utils/markdown";

export type Heading = { level: number; text: string; id: string };

type Props = {
  headings: Heading[];
  activeId: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
};

export default function TILToc({ headings, activeId, onClick }: Props) {
  return (
    <TocCol>
      <TocList>
        {headings.map((h) => (
          <TocItem key={h.id} $level={h.level} $active={activeId === h.id}>
            <a href={`#${h.id}`} onClick={(e) => onClick(e, h.id)}>
              {h.text}
            </a>
          </TocItem>
        ))}
      </TocList>
    </TocCol>
  );
}

const TocCol = styled.aside`
  position: sticky;
  top: ${HEADER_OFFSET - 28}px;
  max-height: calc(100vh - ${HEADER_OFFSET}px);
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  padding: 12px;
  ${({ theme }) => theme.mq.md} {
    display: none;
  }
`;

const TocList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const indent = (level: number) =>
  level <= 1 ? 0 : level === 2 ? 12 : level === 3 ? 20 : 28;

const TocItem = styled.li<{ $level: number; $active: boolean }>`
  a {
    display: block;
    color: ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.subtleText};
    text-decoration: none;
    font-weight: ${({ $active }) => ($active ? 700 : 400)};
    padding-left: ${({ $level }) => indent($level)}px;
  }
`;
