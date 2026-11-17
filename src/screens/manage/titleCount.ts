// "1 title" or "N titles".
export function titleCount(count: number): string {
  return count === 1 ? "1 title" : `${count} titles`;
}
