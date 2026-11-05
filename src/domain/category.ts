import type { Category, NewCategory } from "./types";

/**
 * Makes a new category with a name and a position (the order of the Home tabs).
 * It has no id yet; the database gives it one when it is saved.
 */
export function createCategory(name: string, position: number): NewCategory {
  return { name, position };
}

export function renameCategory(category: Category, name: string): Category {
  return { ...category, name };
}

export function reOrderCategories(
  categories: readonly Category[],
  id: number,
  toPlace: number,
): Category[] {
