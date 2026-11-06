import type { Category, NewCategory, TitleCategory } from "./types";

/** Makes a new category. It has no id yet; the database gives it one. */
export function createCategory(name: string, position: number): NewCategory {
  return { name, position };
}

/** Gives a category a new name. The id and position stay the same. */
export function renameCategory(category: Category, name: string): Category {
  return { ...category, name };
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

/** Removes a category and renumbers the rest. Its links are removed by the database. */
export function removeCategory(
  categories: readonly Category[],
  id: number,
): Category[] {
  return categories
    .filter(category => category.id !== id)
    .map((category, i) => ({ ...category, position: i }));
}

/** True when the title is in at least one category. */
export function isInLibrary(
  categories: readonly TitleCategory[],
  titleId: number,
) {
  return categories.some(link => link.titleId === titleId);
}
