import { and, eq } from "drizzle-orm";
import { titlesTable } from "../schema";
import type { AppDb } from "../types";

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

/** Saves a new episode count for a series, e.g. when TMDB has new episodes. */
export async function updateTotalEpisodes(
  db: AppDb,
  id: number,
  totalEpisodes: number,
) {
  await db
    .update(titlesTable)
    .set({ totalEpisodes: totalEpisodes })
    .where(eq(titlesTable.id, id));
}

/** Marks a movie as watched or not watched. */
export async function markMovieWatched(
  db: AppDb,
  id: number,
  watched: boolean,
) {
  await db
    .update(titlesTable)
    .set({ watched: watched })
    .where(eq(titlesTable.id, id));
}

/** Deletes a title; its watched episodes and category links are deleted with it. */
export async function removeTitle(db: AppDb, id: number) {
  await db.delete(titlesTable).where(eq(titlesTable.id, id));
}
