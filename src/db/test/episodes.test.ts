import { watchedEpisodesTable } from "../schema";
import {
  listWatched,
  markEpisode,
  markEpisodes,
  resetProgress,
  unmarkEpisode,
} from "../episodes";
import { addTitle, getTitle } from "../titles";
import { makeDb } from "../makeDb";

type TitleInput = Parameters<typeof addTitle>[1];

/** Builds a series to save; pass overrides to change single fields. */
function makeTitle(overrides: Partial<TitleInput> = {}): TitleInput {
  return {
    tmdbId: 1396,
    mediaType: "tv",
    name: "Breaking Bad",
    posterPath: null,
    totalEpisodes: 62,
    watched: false,
    ...overrides,
  };
}

/** Creates a database with Breaking Bad and Game of Thrones saved. */
async function makeDbWithTitles() {
  const db = makeDb();
  const breakingBad = await addTitle(db, makeTitle());
  const gameOfThrones = await addTitle(
    db,
    makeTitle({ tmdbId: 1399, name: "Game of Thrones" }),
  );
  return { db, breakingBad, gameOfThrones };
}

const s1e1 = { seasonNumber: 1, episodeNumber: 1 };
const s1e2 = { seasonNumber: 1, episodeNumber: 2 };
const s2e1 = { seasonNumber: 2, episodeNumber: 1 };

describe("markEpisode", () => {
  test("saves S1 E1 with the given time", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    await markEpisode(db, breakingBad, s1e1, 1000);

    expect(db.select().from(watchedEpisodesTable).all()).toEqual([
      { titleId: breakingBad, ...s1e1, watchedAt: 1000 },
    ]);
  });

  test("keeps one row and the first time for an episode marked twice", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    await markEpisode(db, breakingBad, s1e1, 1000);
    await markEpisode(db, breakingBad, s1e1, 2000);

    expect(db.select().from(watchedEpisodesTable).all()).toEqual([
      { titleId: breakingBad, ...s1e1, watchedAt: 1000 },
    ]);
  });

  test("sets lastWatchedAt on the title and leaves other titles alone", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    await markEpisode(db, breakingBad, s1e1, 1000);

    expect((await getTitle(db, 1396, "tv"))?.lastWatchedAt).toBe(1000);
    expect((await getTitle(db, 1399, "tv"))?.lastWatchedAt).toBeNull();
  });
});

describe("markEpisodes", () => {
  test("saves S1 E1, S1 E2 and S2 E1 at once", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    await markEpisodes(db, breakingBad, [s1e1, s1e2, s2e1], 1000);

    expect(await listWatched(db, breakingBad)).toEqual([s1e1, s1e2, s2e1]);
  });

  test("skips episodes that are already watched", async () => {
    const { db, breakingBad } = await makeDbWithTitles();
    await markEpisode(db, breakingBad, s1e1, 1000);

    await markEpisodes(db, breakingBad, [s1e1, s1e2], 2000);

    expect(db.select().from(watchedEpisodesTable).all()).toEqual([
      { titleId: breakingBad, ...s1e1, watchedAt: 1000 },
      { titleId: breakingBad, ...s1e2, watchedAt: 2000 },
    ]);
  });

  test("sets lastWatchedAt on the title", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    await markEpisodes(db, breakingBad, [s1e1, s1e2], 1000);

    expect((await getTitle(db, 1396, "tv"))?.lastWatchedAt).toBe(1000);
    expect((await getTitle(db, 1399, "tv"))?.lastWatchedAt).toBeNull();
  });

  test("does nothing for an empty list", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    await markEpisodes(db, breakingBad, [], 1000);

    expect(await listWatched(db, breakingBad)).toEqual([]);
    expect((await getTitle(db, 1396, "tv"))?.lastWatchedAt).toBeNull();
  });
});

describe("unmarkEpisode", () => {
  test("removes only S1 E2 and keeps S1 E1, S2 E1 and the other title", async () => {
    const { db, breakingBad, gameOfThrones } = await makeDbWithTitles();
    await markEpisodes(db, breakingBad, [s1e1, s1e2, s2e1], 1000);
    await markEpisode(db, gameOfThrones, s1e2, 1000);

    await unmarkEpisode(db, breakingBad, s1e2);

    expect(await listWatched(db, breakingBad)).toEqual([s1e1, s2e1]);
    expect(await listWatched(db, gameOfThrones)).toEqual([s1e2]);
  });
});

describe("listWatched", () => {
  test("returns episodes sorted by season and episode, even when marked out of order", async () => {
    const { db, breakingBad } = await makeDbWithTitles();
    await markEpisode(db, breakingBad, s2e1, 1000);
    await markEpisode(db, breakingBad, s1e2, 1000);
    await markEpisode(db, breakingBad, s1e1, 1000);

    expect(await listWatched(db, breakingBad)).toEqual([s1e1, s1e2, s2e1]);
  });

  test("returns only the episodes of the given title", async () => {
    const { db, breakingBad, gameOfThrones } = await makeDbWithTitles();
    await markEpisode(db, breakingBad, s1e1, 1000);
    await markEpisode(db, gameOfThrones, s2e1, 1000);

    expect(await listWatched(db, breakingBad)).toEqual([s1e1]);
  });

  test("returns an empty list for a title without watched episodes", async () => {
    const { db, breakingBad } = await makeDbWithTitles();

    expect(await listWatched(db, breakingBad)).toEqual([]);
  });
});

describe("resetProgress", () => {
  test("removes all episodes of the title and clears lastWatchedAt", async () => {
    const { db, breakingBad } = await makeDbWithTitles();
    await markEpisodes(db, breakingBad, [s1e1, s1e2, s2e1], 1000);

    await resetProgress(db, breakingBad);

    expect(await listWatched(db, breakingBad)).toEqual([]);
    expect((await getTitle(db, 1396, "tv"))?.lastWatchedAt).toBeNull();
  });

  test("leaves the other title's episodes and lastWatchedAt alone", async () => {
    const { db, breakingBad, gameOfThrones } = await makeDbWithTitles();
    await markEpisode(db, breakingBad, s1e1, 1000);
    await markEpisode(db, gameOfThrones, s1e1, 2000);

    await resetProgress(db, breakingBad);

    expect(await listWatched(db, gameOfThrones)).toEqual([s1e1]);
    expect((await getTitle(db, 1399, "tv"))?.lastWatchedAt).toBe(2000);
  });
});
