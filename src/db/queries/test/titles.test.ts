import {
  categoriesTable,
  titleCategoriesTable,
  watchedEpisodesTable,
} from "../../schema";
import {
  addTitle,
  getTitle,
  markMovieWatched,
  removeTitle,
  updateTotalEpisodes,
} from "../titles";
import { makeDb } from "../../test/makeDb";

type TitleInput = Parameters<typeof addTitle>[1];

/** Builds a title to save; pass overrides to change single fields. */
function makeTitle(overrides: Partial<TitleInput> = {}): TitleInput {
  return {
    tmdbId: 1396,
    mediaType: "tv",
    name: "Breaking Bad",
    posterPath: "/poster.jpg",
    totalEpisodes: 62,
    watched: false,
    ...overrides,
  };
}

describe("getTitle", () => {
  test("returns undefined for a title that isn't saved", async () => {
    const db = makeDb();

    expect(await getTitle(db, 1396, "tv")).toBeUndefined();
  });
});

describe("addTitle", () => {
  test("returns an id that getTitle finds for a new title", async () => {
    const db = makeDb();

    const id = await addTitle(db, makeTitle());

    expect(await getTitle(db, 1396, "tv")).toMatchObject({
      id,
      tmdbId: 1396,
      mediaType: "tv",
      name: "Breaking Bad",
      totalEpisodes: 62,
      watched: false,
    });
  });

  test("sets addedAt to the current time", async () => {
    const db = makeDb();
    const before = Date.now();

    await addTitle(db, makeTitle());

    const saved = await getTitle(db, 1396, "tv");
    expect(saved?.addedAt).toBeGreaterThanOrEqual(before);
    expect(saved?.addedAt).toBeLessThanOrEqual(Date.now());
  });

  test("returns the same id and keeps the old row for a title added twice", async () => {
    const db = makeDb();

    const firstId = await addTitle(db, makeTitle());
    const secondId = await addTitle(db, makeTitle({ name: "Changed name" }));

    expect(secondId).toBe(firstId);
    expect((await getTitle(db, 1396, "tv"))?.name).toBe("Breaking Bad");
  });

  test("returns different ids for a movie and a series with the same TMDB id", async () => {
    const db = makeDb();

    const seriesId = await addTitle(db, makeTitle({ mediaType: "tv" }));
    const movieId = await addTitle(db, makeTitle({ mediaType: "movie" }));

    expect(movieId).not.toBe(seriesId);
    expect(await getTitle(db, 1396, "tv")).toMatchObject({ id: seriesId });
    expect(await getTitle(db, 1396, "movie")).toMatchObject({ id: movieId });
  });
});

describe("updateTotalEpisodes", () => {
  test("saves 70 and then 75 episodes for Breaking Bad", async () => {
    const db = makeDb();
    const id = await addTitle(db, makeTitle({ totalEpisodes: 62 }));

    await updateTotalEpisodes(db, id, 70);
    expect((await getTitle(db, 1396, "tv"))?.totalEpisodes).toBe(70);

    await updateTotalEpisodes(db, id, 75);
    expect((await getTitle(db, 1396, "tv"))?.totalEpisodes).toBe(75);
  });

  test("leaves other titles alone", async () => {
    const db = makeDb();
    const id = await addTitle(db, makeTitle());
    await addTitle(
      db,
      makeTitle({ tmdbId: 1399, name: "Game of Thrones", totalEpisodes: 73 }),
    );

    await updateTotalEpisodes(db, id, 70);

    expect((await getTitle(db, 1399, "tv"))?.totalEpisodes).toBe(73);
  });
});

describe("markMovieWatched", () => {
  test("marks The Matrix as watched and back as not watched", async () => {
    const db = makeDb();
    const id = await addTitle(
      db,
      makeTitle({
        tmdbId: 603,
        mediaType: "movie",
        name: "The Matrix",
        totalEpisodes: 0,
      }),
    );

    await markMovieWatched(db, id, true);
    expect((await getTitle(db, 603, "movie"))?.watched).toBe(true);

    await markMovieWatched(db, id, false);
    expect((await getTitle(db, 603, "movie"))?.watched).toBe(false);
  });

  test("leaves other titles unwatched", async () => {
    const db = makeDb();
    const matrixId = await addTitle(
      db,
      makeTitle({
        tmdbId: 603,
        mediaType: "movie",
        name: "The Matrix",
        totalEpisodes: 0,
      }),
    );
    await addTitle(
      db,
      makeTitle({
        tmdbId: 604,
        mediaType: "movie",
        name: "The Matrix Reloaded",
        totalEpisodes: 0,
      }),
    );

    await markMovieWatched(db, matrixId, true);

    expect((await getTitle(db, 604, "movie"))?.watched).toBe(false);
  });
});

describe("removeTitle", () => {
  test("deletes the title with its watched episodes and category links, but keeps the category", async () => {
    const db = makeDb();
    const id = await addTitle(db, makeTitle());
    const category = db
      .insert(categoriesTable)
      .values({ name: "Library", position: 0 })
      .returning()
      .get();
    db.insert(titleCategoriesTable)
      .values({ titleId: id, categoryId: category.id })
      .run();
    db.insert(watchedEpisodesTable)
      .values({ titleId: id, seasonNumber: 1, episodeNumber: 1, watchedAt: 0 })
      .run();

    await removeTitle(db, id);

    expect(await getTitle(db, 1396, "tv")).toBeUndefined();
    expect(db.select().from(watchedEpisodesTable).all()).toEqual([]);
    expect(db.select().from(titleCategoriesTable).all()).toEqual([]);
    expect(db.select().from(categoriesTable).all()).toHaveLength(1);
  });

  test("leaves other titles alone", async () => {
    const db = makeDb();
    const id = await addTitle(db, makeTitle());
    await addTitle(db, makeTitle({ tmdbId: 1399, name: "Game of Thrones" }));

    await removeTitle(db, id);

    expect(await getTitle(db, 1399, "tv")).toBeDefined();
  });
});
