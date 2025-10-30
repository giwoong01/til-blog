import { useMemo, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../posts/usePosts";
import { HEADER_OFFSET, slugify } from "../utils/markdown";
import TILPostView from "../components/TILPostView";
import TILToc, { type Heading } from "../components/TILToc";

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

  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prevPost =
    currentIndex >= 0 && currentIndex + 1 < posts.length
      ? posts[currentIndex + 1]
      : undefined; // 이전글 = 더 오래된 글
  const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined; // 다음글 = 더 최신 글

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

// page-level layout styles only
