import type { Post } from "../posts/usePosts";

export type MonthlyCount = { month: string; count: number };
export type TagCount = { tag: string; count: number };

export function calcMonthly(posts: Post[]): MonthlyCount[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    const d = p.frontmatter.date;
    if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;
    const key = d.slice(0, 7);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function calcTopTags(posts: Post[], limit = 10): TagCount[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.frontmatter.tags || []) {
      map.set(t, (map.get(t) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export type StreakInfo = { current: number; longest: number };

export function calcStreak(posts: Post[]): StreakInfo {
  const dates = Array.from(
    new Set(
      posts
        .map((p) => p.frontmatter.date)
        .filter((d): d is string => !!d && /^\d{4}-\d{2}-\d{2}$/.test(d))
    )
  ).sort();

  if (dates.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      if (streak > longest) longest = streak;
    } else if (diff > 1) {
      streak = 1;
    }
  }

  // current streak: count backwards from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let current = 0;
  for (let i = dates.length - 1; i >= 0; i--) {
    const d = new Date(dates[i]);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round(
      (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === current) {
      current++;
    } else {
      break;
    }
  }

  return { current, longest };
}
