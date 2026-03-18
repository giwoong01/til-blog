import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";
import { PAGE_SIZE } from "../constants";
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

export default function TagView() {
  const { tag = "" } = useParams();
  const tagValue = decodeURIComponent(tag);
  usePageTitle(`#${tagValue} | TIL`);
  const { posts } = usePosts();
  const [sort, setSort] = useState<SortKey>("new");
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
        <SelectInput
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortKey);
            setPage(1);
          }}
        >
          <option value="new">최신순</option>
          <option value="old">오래된순</option>
        </SelectInput>
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
      <Pagination
        safePage={safePage}
        totalPages={totalPages}
        onPage={setPage}
      />
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
