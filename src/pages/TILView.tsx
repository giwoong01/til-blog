import { useMemo, type ReactNode, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";

const slugify = (text: string): string => {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base;
};
const getTextFromChildren = (children: ReactNode): string => {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children))
    return children.map(getTextFromChildren).join("");
  if (children && typeof children === "object" && "props" in children)
    return getTextFromChildren(
      (children as React.ReactElement<{ children: ReactNode }>).props.children
    );
  return "";
};

type Heading = { level: number; text: string; id: string };

const HEADER_OFFSET = 140;

export default function TILView() {
  const { slug = "" } = useParams();
  const { posts } = usePosts();
  const post = posts.find((p) => p.slug === slug);

  const tocHeadings: Heading[] = useMemo(() => {
    const seen: Record<string, number> = {};
    const out: Heading[] = [];
    const content = post?.content ?? "";
    const re = /^(#{1,4})\s+(.+)$/gm;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content))) {
      const level = m[1].length;
      const text = m[2].trim();
      const base = slugify(text);
      const n = (seen[base] = (seen[base] || 0) + 1);
      const id = n > 1 ? `${base}-${n}` : base;
      out.push({ level, text, id });
    }
    return out;
  }, [post?.content]);

  const [activeId, setActiveId] = useState<string>("");
  useEffect(() => {
    const getActive = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>(
          "article h1[id], article h2[id], article h3[id], article h4[id]"
        )
      );
      if (els.length === 0) return "";
      let current: HTMLElement | null = null;
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        if (top - HEADER_OFFSET <= 0) current = el;
        else break;
      }
      if (!current) current = els[0];
      return current.id;
    };
    const onScroll = () => {
      const id = getActive();
      if (id) setActiveId(id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [post?.slug]);

  if (!post) {
    return (
      <div>
        <p>포스트를 찾을 수 없습니다.</p>
        <Link to="/til">목록으로</Link>
      </div>
    );
  }

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
    const baseHash = window.location.hash.replace(/\/#[^/].*$/, "");
    const newHash = `${baseHash}/#${encodeURIComponent(id)}`;
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${newHash}`
    );
  };

  const renderSeen: Record<string, number> = {};
  const makeHeading =
    (Tag: "h1" | "h2" | "h3" | "h4") =>
    ({ children }: { children?: ReactNode }) => {
      const text = getTextFromChildren(children);
      const base = slugify(text);
      const n = (renderSeen[base] = (renderSeen[base] || 0) + 1);
      const id = n > 1 ? `${base}-${n}` : base;
      return <Tag id={id}>{children}</Tag>;
    };

  const components = {
    h1: makeHeading("h1"),
    h2: makeHeading("h2"),
    h3: makeHeading("h3"),
    h4: makeHeading("h4"),
  } as const;

  return (
    <Wrap>
      <MainCol>
        <Back to="/til">← 목록</Back>
        <Title>{post.frontmatter.title}</Title>
        {post.frontmatter.date && <DateText>{post.frontmatter.date}</DateText>}
        <Tags>
          {(post.frontmatter.tags || []).map((t: string) => (
            <Tag key={t}>#{t}</Tag>
          ))}
        </Tags>
        <Article>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={components}
          >
            {post.content}
          </ReactMarkdown>
        </Article>
      </MainCol>

      <TocCol>
        <TocList>
          {tocHeadings.map((h) => (
            <TocItem key={h.id} $level={h.level} $active={activeId === h.id}>
              <a href={`#${h.id}`} onClick={(e) => handleTocClick(e, h.id)}>
                {h.text}
              </a>
            </TocItem>
          ))}
        </TocList>
      </TocCol>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 24px;
  align-items: start;
  ${({ theme }) => theme.mq.md} {
    grid-template-columns: 1fr;
  }
`;

const MainCol = styled.div`
  max-width: 720px;
  min-width: 0;
`;

const Back = styled(Link)`
  text-decoration: none;
`;
const Title = styled.h1`
  margin-top: 8px;
  font-size: 40px;
  overflow-wrap: anywhere;
  word-break: break-word;
  ${({ theme }) => theme.mq.sm} {
    font-size: 32px;
  }
`;
const DateText = styled.p`
  color: ${({ theme }) => theme.colors.subtleText};
  margin-top: -8px;
`;
const Tags = styled.div`
  margin: 12px 0;
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
const Article = styled.article`
  line-height: 1.75;
  h1,
  h2,
  h3,
  h4 {
    scroll-margin-top: ${HEADER_OFFSET}px;
  }
  h2 {
    margin-top: 28px;
    margin-bottom: 8px;
  }
  h3 {
    margin-top: 18px;
    margin-bottom: 6px;
  }
  pre,
  code {
    background: ${({ theme }) => theme.colors.codeBg};
    color: ${({ theme }) => theme.colors.codeText};
  }
  code {
    padding: 2px 4px;
    border-radius: 6px;
  }
  pre {
    padding: 12px;
    border-radius: 8px;
    overflow: auto;
  }
  /* tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }
  th,
  td {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 8px 12px;
  }
  th {
    text-align: left;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.chip};
  }
`;

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
