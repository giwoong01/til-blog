import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";

export default function TagView() {
  const { tag = "" } = useParams();
  const tagValue = decodeURIComponent(tag);
  const { posts } = usePosts();
  type SortKey = "new" | "old";
  const [sort, setSort] = useState<SortKey>("new");
  const PAGE_SIZE = 12;
  const [page, setPage] = useState<number>(1);

  const filtered = useMemo(() => {
    const f = posts.filter((p) => p.frontmatter.tags?.includes(tagValue));
    f.sort((a, b) => {
      const ad = a.frontmatter.date
        ? new Date(a.frontmatter.date).getTime()
        : 0;
      const bd = b.frontmatter.date
        ? new Date(b.frontmatter.date).getTime()
        : 0;
      return sort === "new" ? bd - ad : ad - bd;
    });
    return f;
  }, [posts, tagValue, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  return (
    <Wrap>
      <Header>
        <Title>#{tagValue}</Title>
        <Select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortKey);
            setPage(1);
          }}
        >
          <option value="new">최신순</option>
          <option value="old">오래된순</option>
        </Select>
      </Header>
      <List>
        {paged.map((p) => (
          <Item key={p.slug}>
            <CardLink to={`/til/${p.slug}`}>
              {p.frontmatter.date && <CardDate>{p.frontmatter.date}</CardDate>}
              <CardTitle>{p.frontmatter.title}</CardTitle>
              <CardDesc>{p.frontmatter.description}</CardDesc>
            </CardLink>
          </Item>
        ))}
      </List>
      <PaginationWrap>
        <PageButton
          type="button"
          onClick={() => setPage((v) => Math.max(1, v - 1))}
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
                onClick={() => setPage(n)}
              >
                {n}
              </PageNumButton>
            )
          )}
        </PageNums>
        <PageButton
          type="button"
          onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
          disabled={safePage >= totalPages}
        >
          다음
        </PageButton>
      </PaginationWrap>
    </Wrap>
  );
}

const Wrap = styled.div``;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  ${({ theme }) => theme.mq.sm} {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;
const Title = styled.h1`
  margin: 0;
`;
const Select = styled.select`
  padding: 10px 38px 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  width: 180px;
  flex: 0 0 180px;
  line-height: 1.2;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px 14px;
  background-image: ${({ theme }) =>
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='${encodeURIComponent(
      theme.colors.subtleText
    )}'><path d='M7 10l5 5 5-5'/></svg>")`};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 0 0 3px rgba(27, 100, 255, 0.25);
  }
  ${({ theme }) => theme.mq.sm} {
    width: 100%;
    flex: initial;
  }
`;
const List = styled.ul`
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  ${({ theme }) => theme.mq.md} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr;
  }
`;
const Item = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;
const CardLink = styled(Link)`
  display: block;
  padding: 16px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;
const CardTitle = styled.h3`
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.4;
  min-height: calc(1.4em * 2);
`;
const CardDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.subtleText};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  line-height: 1.5;
  min-height: calc(1.5em * 2);
`;
const CardDate = styled.p`
  margin: 0 0 6px;
  color: ${({ theme }) => theme.colors.subtleText};
  font-size: 12px;
`;
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

function makePageRange(current: number, total: number): number[] {
  const delta = 1;
  const range: number[] = [];
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);
  const add = (n: number) => range.push(n);
  if (left > 1) add(1);
  if (left > 2) range.push(-1);
  for (let n = left; n <= right; n++) add(n);
  if (right < total - 1) range.push(-1);
  if (right < total) add(total);
  return range;
}
