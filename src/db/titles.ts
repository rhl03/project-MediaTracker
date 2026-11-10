import { and, eq } from "drizzle-orm";
import { titlesTable } from "./schema";
import { AppDb } from "./types";

/** Returns the title with this TMDB id and type, or undefined if it isn't saved. */
export async function getTitle(
  db: AppDb,
  tmdbId: number,
  mediaType: "movie" | "tv",
) {
  const result = await db
    .select()
    .from(titlesTable)
    .where(
      and(eq(titlesTable.tmdbId, tmdbId), eq(titlesTable.mediaType, mediaType)),
    );
  return result[0];
}
/** A title as it's passed in: everything except id (set by SQLite) and addedAt (set by addTitle). */
type TitleInput = Omit<typeof titlesTable.$inferInsert, "id" | "addedAt">;

/** Saves a title and returns its id. If it's already saved, returns the existing id unchanged. */
export async function addTitle(db: AppDb, title: TitleInput): Promise<number> {
  await db
    .insert(titlesTable)
    .values({ ...title, addedAt: Date.now() })
    .onConflictDoNothing();

  const saved = await getTitle(db, title.tmdbId, title.mediaType);
  if (saved === undefined) {
    throw new Error(`Title ${title.tmdbId} was not saved`);
  }
  return saved.id;
}
