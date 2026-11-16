import {
  categoriesTable,
  titleCategoriesTable,
  titlesTable,
} from "../../schema";
import {
  addToCategory,
  countTitles,
  listCategoryIdsForTitle,
  listTitlesInCategory,
  removeFromCategory,
} from "../titleCategories";
import { markEpisodes } from "../episodes";
import { makeDb } from "../../test/makeDb";

// Creates a database with two categories (Library, Watching) and three
// series added at times 1000, 2000 and 3000.
function makeDbWithData() {
  const db = makeDb();
  const [library, watching] = db
    .insert(categoriesTable)
    .values([
      { name: "Library", position: 0 },
      { name: "Watching", position: 1 },
    ])
    .returning()
    .all();
  const [breakingBad, gameOfThrones, theWire] = db
    .insert(titlesTable)
    .values([
      { tmdbId: 1396, mediaType: "tv", name: "Breaking Bad", addedAt: 1000 },
      { tmdbId: 1399, mediaType: "tv", name: "Game of Thrones", addedAt: 2000 },
      { tmdbId: 1438, mediaType: "tv", name: "The Wire", addedAt: 3000 },
    ])
    .returning()
    .all();
  if (!library || !watching || !breakingBad || !gameOfThrones || !theWire) {
    throw new Error("Test data was not saved");
  }
  return {
    db,
    library: library.id,
    watching: watching.id,
    breakingBad: breakingBad.id,
    gameOfThrones: gameOfThrones.id,
    theWire: theWire.id,
  };
}

describe("addToCategory", () => {
  test("puts Breaking Bad into Library", async () => {
    const { db, library, breakingBad } = makeDbWithData();

    await addToCategory(db, breakingBad, library);

    expect(db.select().from(titleCategoriesTable).all()).toEqual([
      { titleId: breakingBad, categoryId: library },
    ]);
  });

  test("keeps one link when the same title is added to the same category twice", async () => {
    const { db, library, breakingBad } = makeDbWithData();

    await addToCategory(db, breakingBad, library);
    await addToCategory(db, breakingBad, library);

    expect(db.select().from(titleCategoriesTable).all()).toHaveLength(1);
  });

  test("lets one title be in two categories", async () => {
    const { db, library, watching, breakingBad } = makeDbWithData();

    await addToCategory(db, breakingBad, library);
    await addToCategory(db, breakingBad, watching);

    expect(await listCategoryIdsForTitle(db, breakingBad)).toEqual([
      library,
      watching,
    ]);
  });
});

describe("removeFromCategory", () => {
  test("takes Breaking Bad out of Watching and keeps it in Library", async () => {
    const { db, library, watching, breakingBad } = makeDbWithData();
    await addToCategory(db, breakingBad, library);
    await addToCategory(db, breakingBad, watching);

    await removeFromCategory(db, breakingBad, watching);

    expect(await listCategoryIdsForTitle(db, breakingBad)).toEqual([library]);
  });

  test("leaves other titles in the same category alone", async () => {
    const { db, watching, breakingBad, gameOfThrones } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);
    await addToCategory(db, gameOfThrones, watching);

    await removeFromCategory(db, breakingBad, watching);

    expect(await listCategoryIdsForTitle(db, gameOfThrones)).toEqual([
      watching,
    ]);
  });

  test("keeps the title itself", async () => {
    const { db, watching, breakingBad } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);

    await removeFromCategory(db, breakingBad, watching);

    expect(db.select().from(titlesTable).all()).toHaveLength(3);
  });
});

describe("countTitles", () => {
  test("returns 2 for Watching with Breaking Bad and Game of Thrones", async () => {
    const { db, library, watching, breakingBad, gameOfThrones, theWire } =
      makeDbWithData();
    await addToCategory(db, breakingBad, watching);
    await addToCategory(db, gameOfThrones, watching);
    await addToCategory(db, theWire, library);

    expect(await countTitles(db, watching)).toBe(2);
  });

  test("returns 0 for an empty category", async () => {
    const { db, watching } = makeDbWithData();

    expect(await countTitles(db, watching)).toBe(0);
  });
});

describe("listCategoryIdsForTitle", () => {
  test("returns an empty list for a title in no category", async () => {
    const { db, breakingBad } = makeDbWithData();

    expect(await listCategoryIdsForTitle(db, breakingBad)).toEqual([]);
  });

  test("returns only the categories of the given title", async () => {
    const { db, library, watching, breakingBad, gameOfThrones } =
      makeDbWithData();
    await addToCategory(db, breakingBad, library);
    await addToCategory(db, gameOfThrones, watching);

    expect(await listCategoryIdsForTitle(db, breakingBad)).toEqual([library]);
  });
});

describe("listTitlesInCategory", () => {
  test("returns the titles in Watching, newest added first", async () => {
    const { db, library, watching, breakingBad, gameOfThrones, theWire } =
      makeDbWithData();
    await addToCategory(db, breakingBad, watching);
    await addToCategory(db, theWire, watching);
    await addToCategory(db, gameOfThrones, library);

    const names = (await listTitlesInCategory(db, watching)).map(
      title => title.name,
    );

    expect(names).toEqual(["The Wire", "Breaking Bad"]);
  });

  test("returns whole title rows, not the links", async () => {
    const { db, watching, breakingBad } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);

    expect(await listTitlesInCategory(db, watching)).toEqual([
      expect.objectContaining({
        id: breakingBad,
        tmdbId: 1396,
        mediaType: "tv",
        name: "Breaking Bad",
      }),
    ]);
  });

  test("returns an empty list for an empty category", async () => {
    const { db, watching } = makeDbWithData();

    expect(await listTitlesInCategory(db, watching)).toEqual([]);
  });

  test("returns watchedCount 0 for a title without watched episodes", async () => {
    const { db, watching, breakingBad } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);

    const [title] = await listTitlesInCategory(db, watching);

    expect(title?.watchedCount).toBe(0);
  });

  test("returns watchedCount 2 for a title with two watched episodes", async () => {
    const { db, watching, breakingBad } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);
    await markEpisodes(
      db,
      breakingBad,
      [
        { seasonNumber: 1, episodeNumber: 1 },
        { seasonNumber: 1, episodeNumber: 2 },
      ],
      5000,
    );

    const [title] = await listTitlesInCategory(db, watching);

    expect(title?.watchedCount).toBe(2);
  });

  test("does not count another title's watched episodes", async () => {
    const { db, watching, breakingBad, theWire } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);
    await addToCategory(db, theWire, watching);
    await markEpisodes(
      db,
      theWire,
      [
        { seasonNumber: 1, episodeNumber: 1 },
        { seasonNumber: 1, episodeNumber: 2 },
        { seasonNumber: 1, episodeNumber: 3 },
      ],
      5000,
    );

    const counts = (await listTitlesInCategory(db, watching)).map(title => [
      title.name,
      title.watchedCount,
    ]);

    expect(counts).toEqual([
      ["The Wire", 3],
      ["Breaking Bad", 0],
    ]);
  });

  test("returns one row per title, not one per watched episode", async () => {
    const { db, watching, breakingBad } = makeDbWithData();
    await addToCategory(db, breakingBad, watching);
    await markEpisodes(
      db,
      breakingBad,
      [
        { seasonNumber: 1, episodeNumber: 1 },
        { seasonNumber: 1, episodeNumber: 2 },
        { seasonNumber: 1, episodeNumber: 3 },
      ],
      5000,
    );

    expect(await listTitlesInCategory(db, watching)).toHaveLength(1);
  });
});
