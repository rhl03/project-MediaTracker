import type { Category, NewCategory, TitleCategory } from "./types";

// Why a category name can't be saved.
export type CategoryNameError = "empty" | "duplicate";

// Makes a new category. It has no id yet; the database gives it one.
export function createCategory(name: string, position: number): NewCategory {
  return { name, position };
}

// Moves a category to a new place and renumbers all positions; unchanged if the id isn't found.
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

// True when a category may be deleted: the last one always has to stay.
export function canRemoveCategory(categories: readonly Category[]): boolean {
  return categories.length > 1;
}

// Removes a category and renumbers the rest; unchanged if it's the last one (links go in the database).
export function removeCategory(
  categories: readonly Category[],
  id: number,
): Category[] {
  if (!canRemoveCategory(categories)) return [...categories];

  return categories
    .filter(category => category.id !== id)
    .map((category, i) => ({ ...category, position: i }));
}

// True when the title is in at least one category.
export function isInLibrary(
  links: readonly TitleCategory[],
  titleId: number,
): boolean {
  return links.some(link => link.titleId === titleId);
}

// Checks a new or changed name: empty, already used (ignoring case and spaces), or null when fine.
export function categoryNameError(
  name: string,
  categories: readonly Category[],
  ignoreId?: number,
): CategoryNameError | null {
  const cleaned = name.trim().toLowerCase();
  if (cleaned === "") return "empty";

  const taken = categories.some(
    category =>
      category.id !== ignoreId &&
      category.name.trim().toLowerCase() === cleaned,
  );
  return taken ? "duplicate" : null;
}
