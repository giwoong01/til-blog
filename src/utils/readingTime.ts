const CHARS_PER_MINUTE = 500;

export function readingTime(content: string): number {
  const chars = content.trim().length;
  return Math.max(1, Math.ceil(chars / CHARS_PER_MINUTE));
}
