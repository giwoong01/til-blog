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
        if (bd !== ad) return bd - ad;
        const ai = extractDailyIndex(a.slug);
        const bi = extractDailyIndex(b.slug);
        if (bi !== ai) return bi - ai;
        return b.slug.localeCompare(a.slug);
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
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dateStr = `${yyyy}-${mm}-${dd}`;
  } else if (typeof d === "string") {
    const m = d.match(/^(\d{4}-\d{2}-\d{2})/);
    dateStr = m ? m[1] : d;
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

function extractDailyIndex(slug: string): number {
  const name = slug.split("/").pop() || slug;
  const m = name.match(/^(\d{4}-\d{2}-\d{2})(?:-(\d+))?$/);
  if (m && m[2]) return parseInt(m[2], 10) || 0;
  const tail = name.match(/-(\d+)$/);
  return tail ? parseInt(tail[1], 10) || 0 : 0;
}
