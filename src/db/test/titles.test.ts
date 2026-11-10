import { addTitle, getTitle } from "../titles";
import { makeDb } from "../makeDb";

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
