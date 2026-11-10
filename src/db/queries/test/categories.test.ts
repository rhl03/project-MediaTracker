import { categoriesTable } from "../../schema";
import {
  addCategory,
  ensureDefaultCategory,
  listCategories,
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
