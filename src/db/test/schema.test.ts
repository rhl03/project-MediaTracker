import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import {
  categoriesTable,
  titleCategoriesTable,
  titlesTable,
  watchedEpisodesTable,
} from "../schema";
import { makeDb } from "../makeDb";

type NewTitleRow = typeof titlesTable.$inferInsert;

/** Builds a title row for inserts; pass overrides to change single fields. */
function makeTitleRow(overrides: Partial<NewTitleRow> = {}): NewTitleRow {
  return {
    tmdbId: 1396,
    mediaType: "tv",
    name: "Breaking Bad",
    addedAt: 0,
    ...overrides,
  };
}

describe("migrations", () => {
  test("creates exactly the five tables", () => {
    const db = makeDb();

    const rows = db.all<{ name: string }>(
      sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name != '__drizzle_migrations' ORDER BY name`,
    );

    expect(rows.map(row => row.name)).toEqual([
      "categories",
      "settings",
      "title_categories",
      "titles",
      "watched_episodes",
    ]);
  });

  test("does nothing when run twice", () => {
    const db = makeDb();
    db.insert(titlesTable).values(makeTitleRow()).run();

    migrate(db, { migrationsFolder: "drizzle" });

    expect(db.select().from(titlesTable).all()).toHaveLength(1);
  });

  test("rejects a media type that is not allowed", () => {
    const db = makeDb();

    expect(() =>
      db.run(
        sql`INSERT INTO titles (tmdb_id, media_type, name, added_at) VALUES (1, 'book', 'Test', 0)`,
      ),
    ).toThrow();
  });

  test("rejects the same title twice", () => {
    const db = makeDb();
    db.insert(titlesTable).values(makeTitleRow()).run();

    expect(() => db.insert(titlesTable).values(makeTitleRow()).run()).toThrow();
  });

  test("keeps the title and its progress when its category is deleted", () => {
    const db = makeDb();
    const title = db
      .insert(titlesTable)
      .values(makeTitleRow())
      .returning()
      .get();
    const category = db
      .insert(categoriesTable)
      .values({ name: "Dropped", position: 0 })
      .returning()
      .get();
    db.insert(titleCategoriesTable)
      .values({ titleId: title.id, categoryId: category.id })
      .run();
    db.insert(watchedEpisodesTable)
      .values({
        titleId: title.id,
        seasonNumber: 1,
        episodeNumber: 1,
        watchedAt: 0,
      })
      .run();

    db.delete(categoriesTable).where(eq(categoriesTable.id, category.id)).run();

    expect(db.select().from(titleCategoriesTable).all()).toEqual([]);
    expect(db.select().from(titlesTable).all()).toHaveLength(1);
    expect(db.select().from(watchedEpisodesTable).all()).toHaveLength(1);
  });

  test("removes watched episodes and links when a title is deleted", () => {
    const db = makeDb();
    const title = db
      .insert(titlesTable)
      .values(makeTitleRow())
      .returning()
      .get();
    const category = db
      .insert(categoriesTable)
      .values({ name: "Watching", position: 0 })
      .returning()
      .get();
    db.insert(titleCategoriesTable)
      .values({ titleId: title.id, categoryId: category.id })
      .run();
    db.insert(watchedEpisodesTable)
      .values({
        titleId: title.id,
        seasonNumber: 1,
        episodeNumber: 1,
        watchedAt: 0,
      })
      .run();

    db.delete(titlesTable).where(eq(titlesTable.id, title.id)).run();

    expect(db.select().from(watchedEpisodesTable).all()).toEqual([]);
    expect(db.select().from(titleCategoriesTable).all()).toEqual([]);
    expect(db.select().from(categoriesTable).all()).toHaveLength(1);
  });
});
