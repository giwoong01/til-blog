export function makePageRange(current: number, total: number): number[] {
  const delta = 1;
  const range: number[] = [];
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);
  const add = (n: number) => range.push(n);
  if (left > 1) add(1);
  if (left > 2) range.push(-1);
  for (let n = left; n <= right; n++) add(n);
  if (right < total - 1) range.push(-1);
  if (right < total) add(total);
  return range;
}
