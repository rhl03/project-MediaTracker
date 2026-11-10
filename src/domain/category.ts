import type { Category, NewCategory, TitleCategory } from "./types";

/** Makes a new category. It has no id yet; the database gives it one. */
export function createCategory(name: string, position: number): NewCategory {
  return { name, position };
}

/**
 * Moves a category to a new place and renumbers all positions: 0, 1, 2…
 * Returns the list unchanged if the id isn't found.
 */
export function reorderCategories(
  categories: readonly Category[],
  id: number,
  toPlace: number,
): Category[] {
  const from = categories.findIndex(category => category.id === id);
  if (from === -1) return [...categories];

  const result = [...categories];
  const [moved] = result.splice(from, 1);
  if (!moved) return [...categories];

  result.splice(toPlace, 0, moved);

  return result.map((category, position) => ({ ...category, position }));
}

/** True when a category may be deleted: the last one always has to stay. */
export function canRemoveCategory(categories: readonly Category[]): boolean {
  return categories.length > 1;
}

/**
 * Removes a category and renumbers the rest. Its links are removed by the database.
 * Returns the list unchanged if it's the last category.
 */
export function removeCategory(
  categories: readonly Category[],
  id: number,
): Category[] {
  if (!canRemoveCategory(categories)) return [...categories];

  return categories
    .filter(category => category.id !== id)
    .map((category, i) => ({ ...category, position: i }));
}

/** True when the title is in at least one category. */
export function isInLibrary(
  links: readonly TitleCategory[],
  titleId: number,
): boolean {
  return links.some(link => link.titleId === titleId);
}
