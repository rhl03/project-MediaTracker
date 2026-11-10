import { ensureDefaultCategory } from "../categories";
import { categoriesTable } from "../../schema";
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
