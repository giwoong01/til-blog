import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import styled from "styled-components";
import type { Post } from "../posts/usePosts";
import { HEADER_OFFSET, slugify, getTextFromChildren } from "../utils/markdown";

type Props = {
  post: Post;
  prevPost?: Post;
  nextPost?: Post;
  getCommonTags: (tags?: string[]) => string[];
};

export default function TILPostView({
  post,
  prevPost,
  nextPost,
  getCommonTags,
}: Props) {
  const [copied, setCopied] = useState(false);

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
    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const raw = props.src || "";
      const base = import.meta.env.BASE_URL || "/";
      const normalized = raw.startsWith("/")
        ? base + raw.replace(/^\//, "")
        : raw;
      return <img {...props} src={normalized} loading="lazy" />;
    },
  } as const;

  return (
    <>
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

      {(prevPost || nextPost) && (
        <PostNav>
          <div>
            {prevPost && (
              <PostNavLink to={`/til/${prevPost.slug}`} $align="left">
                <small>이전글</small>
                <span>{prevPost.frontmatter.title || prevPost.slug}</span>
                {getCommonTags(prevPost.frontmatter.tags).length > 0 && (
                  <CommonTags>
                    {getCommonTags(prevPost.frontmatter.tags)
                      .slice(0, 3)
                      .map((t) => (
                        <NavTag key={t}>#{t}</NavTag>
                      ))}
                    {getCommonTags(prevPost.frontmatter.tags).length > 3 && (
                      <NavTagMore>
                        +{getCommonTags(prevPost.frontmatter.tags).length - 3}
                      </NavTagMore>
                    )}
                  </CommonTags>
                )}
              </PostNavLink>
            )}
          </div>
          <div>
            {nextPost && (
              <PostNavLink to={`/til/${nextPost.slug}`} $align="right">
                <small>다음글</small>
                <span>{nextPost.frontmatter.title || nextPost.slug}</span>
                {getCommonTags(nextPost.frontmatter.tags).length > 0 && (
                  <CommonTags>
                    {getCommonTags(nextPost.frontmatter.tags)
                      .slice(0, 3)
                      .map((t) => (
                        <NavTag key={t}>#{t}</NavTag>
                      ))}
                    {getCommonTags(nextPost.frontmatter.tags).length > 3 && (
                      <NavTagMore>
                        +{getCommonTags(nextPost.frontmatter.tags).length - 3}
                      </NavTagMore>
                    )}
                  </CommonTags>
                )}
              </PostNavLink>
            )}
          </div>
        </PostNav>
      )}

      <ShareBar>
        <IconButton
          type="button"
          aria-label="공유"
          onClick={async () => {
            const shareUrl = window.location.href;
            const title = post.frontmatter.title || document.title;
            if (navigator.share) {
              try {
                await navigator.share({ title, text: title, url: shareUrl });
                return;
              } catch {
                // fallthrough to copy
              }
            }
            try {
              await navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              // ignore
            }
          }}
        >
          <ShareSvg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 0 6c.62 0 1.2-.19 1.68-.5l-7.04 3.76A3 3 0 0 0 6 13a3 3 0 1 0 2.83 4h.17a3 3 0 0 0 0-6c-.62 0-1.2.19-1.68.5l7.04-3.76C14.8 7.19 15.38 7 16 7c.62 0 1.2.19 1.68.5L18 8z"
              fill="currentColor"
            />
          </ShareSvg>
          <span>{copied ? "복사됨" : "공유"}</span>
        </IconButton>
      </ShareBar>
    </>
  );
}

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
  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 12px auto;
  }
  pre,
  code {
    background: ${({ theme }) => theme.colors.codeBg};
    color: ${({ theme }) => theme.colors.codeText};
  }
  blockquote {
    margin: 12px 0;
    padding: 8px 12px;
    border-left: 4px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
  }
  blockquote > :first-child {
    margin-top: 0;
  }
  blockquote > :last-child {
    margin-bottom: 0;
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

const PostNav = styled.nav`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 12px;
  align-items: stretch;
  & > div {
    display: flex;
    min-width: 0;
  }
  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr;
  }
`;

const PostNavLink = styled(Link)<{ $align: "left" | "right" }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 12px;
  text-align: ${({ $align }) => $align};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  height: 100%;
  min-width: 0;
  min-height: 88px;
  gap: 4px;
  width: 100%;
  flex: 1 1 auto;
  small {
    display: block;
    color: ${({ theme }) => theme.colors.subtleText};
    margin-bottom: 0;
  }
  span {
    display: block;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: normal;
    word-break: keep-all;
    min-width: 0;
  }
`;

const ShareBar = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 8px 10px;
  cursor: pointer;
`;

const ShareSvg = styled.svg``;

const CommonTags = styled.div`
  margin-top: 6px;
  display: flex;
  gap: 4px;
  align-items: center;
`;

const NavTag = styled.span`
  display: inline-block;
  font-size: 11px;
  background: ${({ theme }) => theme.colors.chip};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const NavTagMore = styled(NavTag)`
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;
