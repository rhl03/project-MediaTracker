// "1 title" or "N titles".
export function titleCount(count: number): string {
  return count === 1 ? "1 title" : `${count} titles`;
}

// The delete warning for a category with this many titles.
export function deleteCategoryMessage(count: number): string {
  return count === 0
    ? "It has no titles."
    : `${titleCount(count)} will only lose this category. Progress is kept.`;
}
