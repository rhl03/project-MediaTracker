import { createCategory } from "../domain/category";
import { categoriesTable } from "./schema";
import type { AppDb } from "./types";

/** Creates the "Library" category on first launch, when there are no categories yet. */
export async function ensureDefaultCategory(db: AppDb): Promise<void> {
  const categories = await db.select().from(categoriesTable);

  if (categories.length === 0) {
    await db.insert(categoriesTable).values(createCategory("Library", 0));
  }
}
