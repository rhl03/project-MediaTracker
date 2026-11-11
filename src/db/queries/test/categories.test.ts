import {
  categoriesTable,
  titleCategoriesTable,
  titlesTable,
} from "../../schema";
import {
  addCategory,
  deleteCategory,
  ensureDefaultCategory,
  listCategories,
  moveCategory,
  renameCategory,
} from "../categories";
import { makeDb } from "../../test/makeDb";

describe("ensureDefaultCategory", () => {
  test("creates Library at position 0 for an empty database", async () => {
    const db = makeDb();

    await ensureDefaultCategory(db);

    const categories = db.select().from(categoriesTable).all();
    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({ name: "Library", position: 0 });
  });

  test("creates Library only once when run twice", async () => {
    const db = makeDb();

    await ensureDefaultCategory(db);
    await ensureDefaultCategory(db);

    expect(db.select().from(categoriesTable).all()).toHaveLength(1);
  });

  test("leaves existing categories untouched", async () => {
    const db = makeDb();
    db.insert(categoriesTable).values({ name: "Watching", position: 0 }).run();

    await ensureDefaultCategory(db);

    const categories = db.select().from(categoriesTable).all();
    expect(categories).toHaveLength(1);
    expect(categories[0]).toMatchObject({ name: "Watching", position: 0 });
  });
});

describe("listCategories", () => {
  test("returns categories sorted by position, not by when they were added", async () => {
    const db = makeDb();
    db.insert(categoriesTable)
      .values([
        { name: "Done", position: 2 },
        { name: "Library", position: 0 },
        { name: "Watching", position: 1 },
      ])
      .run();

    const names = (await listCategories(db)).map(category => category.name);

    expect(names).toEqual(["Library", "Watching", "Done"]);
  });

  test("returns an empty list when there are no categories", async () => {
    const db = makeDb();

    expect(await listCategories(db)).toEqual([]);
  });
});

describe("addCategory", () => {
  test("adds Anime at position 0 to an empty list and returns its id", async () => {
    const db = makeDb();

    const id = await addCategory(db, "Anime");

    expect(await listCategories(db)).toEqual([
      { id, name: "Anime", position: 0 },
    ]);
  });

  test("adds Anime after Library and Watching at position 2", async () => {
    const db = makeDb();
    await ensureDefaultCategory(db);
    await addCategory(db, "Watching");

    await addCategory(db, "Anime");

    const categories = await listCategories(db);
    expect(categories.map(category => category.name)).toEqual([
      "Library",
      "Watching",
      "Anime",
    ]);
    expect(categories[2]?.position).toBe(2);
  });

  test("returns a different id for each new category", async () => {
    const db = makeDb();

    const first = await addCategory(db, "Anime");
    const second = await addCategory(db, "Drama");

    expect(second).not.toBe(first);
  });
});

describe("renameCategory", () => {
  test("renames Anime to Drama and keeps its id and position", async () => {
    const db = makeDb();
    await ensureDefaultCategory(db);
    const id = await addCategory(db, "Anime");

    await renameCategory(db, id, "Drama");

    expect((await listCategories(db))[1]).toEqual({
      id,
      name: "Drama",
      position: 1,
    });
  });

  test("leaves other categories alone", async () => {
    const db = makeDb();
    await ensureDefaultCategory(db);
    const id = await addCategory(db, "Anime");

    await renameCategory(db, id, "Drama");

    expect((await listCategories(db))[0]?.name).toBe("Library");
  });
});

/** Creates a database with Library 0, Watching 1, Dropped 2 and Done 3. */
async function makeDbWithFour() {
  const db = makeDb();
  await ensureDefaultCategory(db);
  const watching = await addCategory(db, "Watching");
  const dropped = await addCategory(db, "Dropped");
  const done = await addCategory(db, "Done");
  return { db, watching, dropped, done };
}

/** Returns the categories as "name position" strings, e.g. "Done 2". */
async function namesAndPositions(db: Parameters<typeof listCategories>[0]) {
  return (await listCategories(db)).map(
    category => `${category.name} ${category.position}`,
  );
}

describe("moveCategory", () => {
  test("moves Done to the front: Done 0, Library 1, Watching 2, Dropped 3", async () => {
    const { db, done } = await makeDbWithFour();

    await moveCategory(db, done, 0);

    expect(await namesAndPositions(db)).toEqual([
      "Done 0",
      "Library 1",
      "Watching 2",
      "Dropped 3",
    ]);
  });

  test("moves Watching to the end: Library 0, Dropped 1, Done 2, Watching 3", async () => {
    const { db, watching } = await makeDbWithFour();

    await moveCategory(db, watching, 3);

    expect(await namesAndPositions(db)).toEqual([
      "Library 0",
      "Dropped 1",
      "Done 2",
      "Watching 3",
    ]);
  });

  test("changes nothing for an id that doesn't exist (99)", async () => {
    const { db } = await makeDbWithFour();

    await moveCategory(db, 99, 0);

    expect(await namesAndPositions(db)).toEqual([
      "Library 0",
      "Watching 1",
      "Dropped 2",
      "Done 3",
    ]);
  });
});

describe("deleteCategory", () => {
  test("deletes Dropped and closes the gap: Library 0, Watching 1, Done 2", async () => {
    const { db, dropped } = await makeDbWithFour();

    await deleteCategory(db, dropped);

    expect(await namesAndPositions(db)).toEqual([
      "Library 0",
      "Watching 1",
      "Done 2",
    ]);
  });

  test("keeps the last category (Library)", async () => {
    const db = makeDb();
    await ensureDefaultCategory(db);
    const library = (await listCategories(db))[0];

    await deleteCategory(db, library?.id ?? -1);

    expect(await namesAndPositions(db)).toEqual(["Library 0"]);
  });

  test("removes the category's title links but keeps the title", async () => {
    const { db, dropped } = await makeDbWithFour();
    const title = db
      .insert(titlesTable)
      .values({
        tmdbId: 1396,
        mediaType: "tv",
        name: "Breaking Bad",
        addedAt: 0,
      })
      .returning()
      .get();
    db.insert(titleCategoriesTable)
      .values({ titleId: title.id, categoryId: dropped })
      .run();

    await deleteCategory(db, dropped);

    expect(db.select().from(titleCategoriesTable).all()).toEqual([]);
    expect(db.select().from(titlesTable).all()).toHaveLength(1);
  });

  test("changes nothing for an id that doesn't exist (99)", async () => {
    const { db } = await makeDbWithFour();

    await deleteCategory(db, 99);

    expect(await namesAndPositions(db)).toEqual([
      "Library 0",
      "Watching 1",
      "Dropped 2",
      "Done 3",
    ]);
  });
});
