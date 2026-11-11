import { asc, eq } from "drizzle-orm";
import {
  canRemoveCategory,
  createCategory,
  removeCategory,
  reorderCategories,
} from "../../domain/category";
import type { Category } from "../../domain/types";
import { categoriesTable } from "../schema";
import type { AppDb } from "../types";

/** Creates the "Library" category on first launch, when there are no categories yet. */
export async function ensureDefaultCategory(db: AppDb): Promise<void> {
  const categories = await db.select().from(categoriesTable);

  if (categories.length === 0) {
    await db.insert(categoriesTable).values(createCategory("Library", 0));
  }
}

/** Returns all categories in Home tab order (position 0 first). */
export async function listCategories(db: AppDb): Promise<Category[]> {
  return db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.position));
}

/** Adds a category at the end of the list and returns its id. */
export async function addCategory(db: AppDb, name: string): Promise<number> {
  const categories = await listCategories(db);
  const position = Math.max(-1, ...categories.map(c => c.position)) + 1;

  const inserted = await db
    .insert(categoriesTable)
    .values(createCategory(name, position))
    .returning({ id: categoriesTable.id });

  const id = inserted[0]?.id;
  if (id === undefined) {
    throw new Error(`Category ${name} was not saved`);
  }
  return id;
}

/** Gives a category a new name. Its id and position stay the same. */
export async function renameCategory(
  db: AppDb,
  id: number,
  name: string,
): Promise<void> {
  await db
    .update(categoriesTable)
    .set({ name })
    .where(eq(categoriesTable.id, id));
}

/** Saves each category's position. Used after moving or deleting a category. */
async function savePositions(
  db: AppDb,
  categories: readonly Category[],
): Promise<void> {
  for (const category of categories) {
    await db
      .update(categoriesTable)
      .set({ position: category.position })
      .where(eq(categoriesTable.id, category.id));
  }
}

/** Moves a category to a new place in the Home tabs and saves the new order. */
export async function moveCategory(db: AppDb, id: number, toPlace: number) {
  const categories = await listCategories(db);
  const moved = reorderCategories(categories, id, toPlace);
  await savePositions(db, moved);
}

/** Deletes a category and closes the gap in the positions. The last category is kept. */
export async function deleteCategory(db: AppDb, id: number) {
  const categories = await listCategories(db);
  if (!canRemoveCategory(categories)) {
    return;
  }
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  await savePositions(db, removeCategory(categories, id));
}
