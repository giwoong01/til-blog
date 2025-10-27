import matter from "gray-matter";
import { useEffect, useMemo, useState } from "react";

type FrontMatter = {
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
};

export type Post = {
  slug: string;
  frontmatter: FrontMatter;
  content: string;
};

const modules = import.meta.glob<string>("/src/til/**/*.md", {
  query: "?raw",
  import: "default",
});

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const entries = Object.entries(modules);
      const loaded = await Promise.all(
        entries.map(async ([path, loader]) => {
          const raw = (await loader()) as string;
          const { data, content } = matter(raw);
          const slug = path.replace("/src/til/", "").replace(/\.md$/, "");
          const frontmatter = normalizeFrontmatter(data);
          return {
            slug,
            frontmatter,
            content,
          } as Post;
        })
      );

      loaded.sort((a, b) => {
        const ad = a.frontmatter.date
          ? new Date(a.frontmatter.date).getTime()
          : 0;
        const bd = b.frontmatter.date
          ? new Date(b.frontmatter.date).getTime()
          : 0;
        return bd - ad;
      });
      setPosts(loaded);
    })();
  }, []);

  return useMemo(() => ({ posts }), [posts]);
}

function normalizeFrontmatter(data: unknown): FrontMatter {
  const obj = (data || {}) as Record<string, unknown>;
  const d = obj.date as unknown;
  let dateStr: string | undefined = undefined;
  if (d instanceof Date) {
    dateStr = d.toISOString().slice(0, 10);
  } else if (typeof d === "string") {
    dateStr = d;
  }

  const tagsVal = obj.tags as unknown;
  const tags = Array.isArray(tagsVal)
    ? tagsVal.map((t) => String(t))
    : undefined;

  return {
    title: typeof obj.title === "string" ? obj.title : "",
    description:
      typeof obj.description === "string" ? obj.description : undefined,
    date: dateStr,
    tags,
  };
}
