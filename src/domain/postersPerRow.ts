// Fewest posters per row in the Library grid.
export const MIN_POSTERS_PER_ROW = 2;

// Most posters per row in the Library grid.
export const MAX_POSTERS_PER_ROW = 6;

// Posters per row before the user picks a number.
export const DEFAULT_POSTERS_PER_ROW = 4;

// The saved text as a whole number in range, or the default when it's missing or broken.
export function parsePostersPerRow(saved: string | undefined): number {
  if (saved === undefined || saved.trim() === "") {
    return DEFAULT_POSTERS_PER_ROW;
  }
  const value = Number(saved);
  if (!Number.isInteger(value)) {
    return DEFAULT_POSTERS_PER_ROW;
  }
  return Math.min(MAX_POSTERS_PER_ROW, Math.max(MIN_POSTERS_PER_ROW, value));
}
