export const ALL_KEY = "전체";

export const isMonthKey = (key: string) => /^\d{4}-\d{2}$/.test(key);

export function formatMonth(key: string): string {
  if (key === "기타") return "기타";
  const m = key.match(/^(\d{4})-(\d{2})$/);
  if (!m) return key;
  return `${m[1]}년 ${parseInt(m[2], 10)}월`;
}
