import { and, eq } from "drizzle-orm";
import type { LatestEpisodeType } from "../../domain/types";
import { titlesTable, watchedEpisodesTable } from "../schema";
import type { AppDb } from "../types";

/** Marks one episode as watched and saves when the title was last watched. */
export async function markEpisode(
  db: AppDb,
  titleId: number,
  ref: LatestEpisodeType,
  now: number,
): Promise<void> {
  await db
    .insert(watchedEpisodesTable)
    .values({
      titleId,
      seasonNumber: ref.seasonNumber,
      episodeNumber: ref.episodeNumber,
      watchedAt: now,
    })
    .onConflictDoNothing();

  await db
    .update(titlesTable)
    .set({ lastWatchedAt: now })
    .where(eq(titlesTable.id, titleId));
}

/** Marks several episodes as watched at once, e.g. "up to here" or Mark as Done. */
export async function markEpisodes(
  db: AppDb,
  titleId: number,
  refs: readonly LatestEpisodeType[],
  now: number,
): Promise<void> {
  if (refs.length === 0) {
    return;
  }

  await db
    .insert(watchedEpisodesTable)
    .values(
      refs.map(ref => ({
        titleId,
        seasonNumber: ref.seasonNumber,
        episodeNumber: ref.episodeNumber,
        watchedAt: now,
      })),
    )
    .onConflictDoNothing();

  await db
    .update(titlesTable)
    .set({ lastWatchedAt: now })
    .where(eq(titlesTable.id, titleId));
}

/** Marks one episode as not watched. */
export async function unmarkEpisode(
  db: AppDb,
  titleId: number,
  ref: LatestEpisodeType,
): Promise<void> {
  await db
    .delete(watchedEpisodesTable)
    .where(
      and(
        eq(watchedEpisodesTable.titleId, titleId),
        eq(watchedEpisodesTable.seasonNumber, ref.seasonNumber),
        eq(watchedEpisodesTable.episodeNumber, ref.episodeNumber),
      ),
    );
}

/** Returns the watched episodes of a title, sorted by season and episode. */
export async function listWatched(
  db: AppDb,
  titleId: number,
): Promise<LatestEpisodeType[]> {
  return db
    .select({
      seasonNumber: watchedEpisodesTable.seasonNumber,
      episodeNumber: watchedEpisodesTable.episodeNumber,
    })
    .from(watchedEpisodesTable)
    .where(eq(watchedEpisodesTable.titleId, titleId))
    .orderBy(
      watchedEpisodesTable.seasonNumber,
      watchedEpisodesTable.episodeNumber,
    );
}

/** Unmarks every episode of a title and clears when it was last watched. */
export async function resetProgress(db: AppDb, titleId: number): Promise<void> {
  await db
    .delete(watchedEpisodesTable)
    .where(eq(watchedEpisodesTable.titleId, titleId));

  await db
    .update(titlesTable)
    .set({ lastWatchedAt: null })
    .where(eq(titlesTable.id, titleId));
}
