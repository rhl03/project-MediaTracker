import type { Category, NewCategory, TitleCategory } from "./types";

/**
 * Makes a new category with a name and a position (the order of the Home tabs).
 * It has no id yet; the database gives it one when it is saved.
 */
export function createCategory(name: string, position: number): NewCategory {
  return { name, position };
}

/**
 * Gives a category a new name. The id and position stay the same.
 */
export function renameCategory(category: Category, name: string): Category {
  return { ...category, name };
}

/**
 * Moves one category to a new place in the list (the order of the Home tabs).
 * Every category gets a new position from its place: 0, 1, 2… with no gaps.
 * Returns the list unchanged if no category has that id.
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

/**
 * Removes a category from the list. The others get new positions: 0, 1, 2…
 * with no gaps. Its titles only lose this category; their progress is kept.
 */
export function removeCategory(
  categories: readonly Category[],
  id: number,
): Category[] {
  return categories
    .filter(category => category.id !== id)
    .map((category, i) => ({ ...category, position: i }));
}

export function isInLibrary(
  categories: readonly TitleCategory[],
  titleId: number,
) {
  return categories.some(categories => categories.titleId === titleId);
}
