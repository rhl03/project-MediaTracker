import { and, count, desc, eq } from "drizzle-orm";
import { titleCategoriesTable, titlesTable } from "../schema";
import type { AppDb } from "../types";

type TitleRow = typeof titlesTable.$inferSelect;

/** Puts a title into a category. Does nothing if it's already there. */
export async function addToCategory(
  db: AppDb,
  titleId: number,
  categoryId: number,
) {
  await db
    .insert(titleCategoriesTable)
    .values({ titleId, categoryId })
    .onConflictDoNothing();
}

/** Takes a title out of a category. Its progress is kept. */
export async function removeFromCategory(
  db: AppDb,
  titleId: number,
  categoryId: number,
) {
  await db
    .delete(titleCategoriesTable)
    .where(
      and(
        eq(titleCategoriesTable.titleId, titleId),
        eq(titleCategoriesTable.categoryId, categoryId),
      ),
    );
}

/** Counts the titles in a category, e.g. for the delete warning. */
export async function countTitles(db: AppDb, categoryId: number) {
  const result = await db
    .select({ count: count() })
    .from(titleCategoriesTable)
    .where(eq(titleCategoriesTable.categoryId, categoryId));
  return result[0]?.count ?? 0;
}

/** Returns the ids of the categories a title is in, e.g. for the ticked boxes in the Add dialog. */
export async function listCategoryIdsForTitle(db: AppDb, titleId: number) {
  return (
    await db
      .select({ categoryId: titleCategoriesTable.categoryId })
      .from(titleCategoriesTable)
      .where(eq(titleCategoriesTable.titleId, titleId))
  ).map(row => row.categoryId);
}

/** Returns the titles in a category for its Home tab, newest added first. */
export async function listTitlesInCategory(
  db: AppDb,
  categoryId: number,
): Promise<TitleRow[]> {
  const rows = await db
    .select()
    .from(titlesTable)
    .innerJoin(
      titleCategoriesTable,
      eq(titleCategoriesTable.titleId, titlesTable.id),
    )
    .where(eq(titleCategoriesTable.categoryId, categoryId))
    .orderBy(desc(titlesTable.addedAt));
  return rows.map(row => row.titles);
}
