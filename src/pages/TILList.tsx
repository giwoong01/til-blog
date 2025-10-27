import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";

export default function TILList() {
  const { posts } = usePosts();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  type SortKey = "new" | "old";
  const [sort, setSort] = useState<SortKey>("new");

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

  return (
    <Wrap>
      <Controls>
        <Input
          placeholder="검색어"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">전체 태그</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          <option value="new">최신순</option>
          <option value="old">오래된순</option>
        </Select>
      </Controls>

      <List>
        {filtered.map((p) => (
          <Item key={p.slug}>
            <CardLink to={`/til/${p.slug}`}>
              <CardTitle>{p.frontmatter.title}</CardTitle>
              <CardDesc>{p.frontmatter.description}</CardDesc>
              <Tags>
                {(p.frontmatter.tags || []).map((t: string) => (
                  <Tag key={t}>#{t}</Tag>
                ))}
              </Tags>
            </CardLink>
          </Item>
        ))}
      </List>
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
`;
const CardDesc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.subtleText};
`;
const Tags = styled.div`
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;
const Tag = styled.span`
  font-size: 12px;
  background: ${({ theme }) => theme.colors.chip};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
`;
