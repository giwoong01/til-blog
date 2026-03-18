import styled from "styled-components";
import { makePageRange } from "../../utils/pagination";

type PaginationProps = {
  safePage: number;
  totalPages: number;
  onPage: (p: number) => void;
};

export default function Pagination({
  safePage,
  totalPages,
  onPage,
}: PaginationProps) {
  return (
    <PaginationWrap>
      <PageButton
        type="button"
        onClick={() => onPage(safePage - 1)}
        disabled={safePage <= 1}
      >
        이전
      </PageButton>
      <PageNums>
        {makePageRange(safePage, totalPages).map((n, idx) =>
          n === -1 ? (
            <Ellipsis key={`e-${idx}`}>…</Ellipsis>
          ) : (
            <PageNumButton
              key={n}
              data-active={String(n === safePage)}
              type="button"
              onClick={() => onPage(n)}
            >
              {n}
            </PageNumButton>
          )
        )}
      </PageNums>
      <PageButton
        type="button"
        onClick={() => onPage(safePage + 1)}
        disabled={safePage >= totalPages}
      >
        다음
      </PageButton>
    </PaginationWrap>
  );
}

const PaginationWrap = styled.nav`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const PageNums = styled.div`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`;

const PageNumButton = styled(PageButton)`
  &[data-active="true"] {
    background: ${({ theme }) => theme.colors.chip};
    font-weight: 700;
  }
`;

const Ellipsis = styled.span`
  color: ${({ theme }) => theme.colors.subtleText};
`;
