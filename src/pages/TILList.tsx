import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";
import { PAGE_SIZE } from "../constants";
import { usePageTitle } from "../hooks/usePageTitle";
import { SelectInput } from "../components/shared/SelectInput";
import {
  List,
  Item,
  CardLink,
  CardTitle,
  CardDesc,
  CardDate,
} from "../components/shared/PostCardList";
import Pagination from "../components/shared/Pagination";

type SortKey = "new" | "old";

export default function TILList() {
  usePageTitle("TIL Blog");
  const { posts } = usePosts();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortKey>("new");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState<number>(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  });

  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    const next = Number.isFinite(p) && p > 0 ? p : 1;
    setPage(next);
  }, [searchParams]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.frontmatter.tags?.forEach((t: string) => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const f = posts.filter((p) => {
      const matchesQ =
        !ql ||
        p.frontmatter.title?.toLowerCase().includes(ql) ||
        p.frontmatter.description?.toLowerCase().includes(ql) ||
        p.content.toLowerCase().includes(ql);
      const matchesTag = !tag || p.frontmatter.tags?.includes(tag);
      return matchesQ && matchesTag;
    });
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
  }, [posts, q, tag, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paged = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  useEffect(() => {
    setPage(1);
    const next = new URLSearchParams(searchParams);
    next.set("page", "1");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tag, sort]);

  const goPage = (p: number) => {
    const nextPage = Math.min(Math.max(1, p), totalPages);
    setPage(nextPage);
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
  };

  return (
    <Wrap>
      <Controls>
        <Input
          placeholder="검색어"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <SelectInput value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">전체 태그</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="new">최신순</option>
          <option value="old">오래된순</option>
        </SelectInput>
      </Controls>

      <List>
        {paged.map((p) => (
          <Item key={p.slug}>
            <CardLink to={`/til/${p.slug}`}>
              {p.frontmatter.date && <CardDate>{p.frontmatter.date}</CardDate>}
              <CardTitle>{p.frontmatter.title}</CardTitle>
              <CardDesc>{p.frontmatter.description}</CardDesc>
              <Tags>
                {(p.frontmatter.tags || []).slice(0, 3).map((t: string) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
                {(p.frontmatter.tags || []).length > 3 && (
                  <TagMore>+{(p.frontmatter.tags || []).length - 3}</TagMore>
                )}
              </Tags>
            </CardLink>
          </Item>
        ))}
      </List>
      <Pagination
        safePage={safePage}
        totalPages={totalPages}
        onPage={goPage}
      />
    </Wrap>
  );
}

const Wrap = styled.div``;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  ${({ theme }) => theme.mq.sm} {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;
const Input = styled.input`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  min-width: 0;
  line-height: 1.2;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  &::placeholder {
    color: ${({ theme }) => theme.colors.subtleText};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 0 0 0 3px rgba(27, 100, 255, 0.25);
  }
  ${({ theme }) => theme.mq.sm} {
    grid-column: 1 / -1;
    width: 100%;
  }
`;
const Tags = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
`;
const Tag = styled.span`
  font-size: 12px;
  background: ${({ theme }) => theme.colors.chip};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
`;
const TagMore = styled(Tag)`
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;
