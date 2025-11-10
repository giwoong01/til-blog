import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";
import { HEADER_OFFSET } from "../utils/markdown";
import TILPostView from "../components/TILPostView";
import TILToc, { type Heading } from "../components/TILToc";

export default function TILView() {
  const { slug = "" } = useParams();
  const { posts } = usePosts();
  const post = posts.find((p) => p.slug === slug);

  const [tocHeadings, setTocHeadings] = useState<Heading[]>([]);
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "article h1[id], article h2[id], article h3[id], article h4[id]"
      )
    );
    const out: Heading[] = els.map((el) => {
      const tag = el.tagName.toLowerCase();
      const level = tag === "h1" ? 1 : tag === "h2" ? 2 : tag === "h3" ? 3 : 4;
      return {
        level,
        text: (el.textContent || "").trim(),
        id: el.id,
      };
    });
    setTocHeadings(out);
  }, [post?.slug]);

  const [activeId, setActiveId] = useState<string>("");
  const suppressUntilRef = useRef<number>(0);
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
      if (Date.now() < suppressUntilRef.current) return;
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

  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prevPost =
    currentIndex >= 0 && currentIndex + 1 < posts.length
      ? posts[currentIndex + 1]
      : undefined;
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;

  const currentTags = (post.frontmatter.tags || []).map((t) => String(t));
  const getCommonTags = (other?: string[]) => {
    const set = new Set((other || []).map((t) => String(t)));
    const out = currentTags.filter((t) => set.has(t));
    return Array.from(new Set(out));
  };

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    suppressUntilRef.current = Date.now() + 1000;
    setActiveId(id);
    const pathname = window.location.pathname;
    const search = window.location.search;
    history.replaceState(
      null,
      "",
      `${pathname}${search}#${encodeURIComponent(id)}`
    );
  };

  return (
    <Wrap>
      <MainCol>
        <TILPostView
          post={post}
          prevPost={prevPost}
          nextPost={nextPost}
          getCommonTags={getCommonTags}
        />
      </MainCol>
      <TILToc
        headings={tocHeadings}
        activeId={activeId}
        onClick={handleTocClick}
      />
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
