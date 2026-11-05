import {
  createCategory,
  removeCategory,
  renameCategory,
  reorderCategories,
} from "../category";
import type { Category } from "../types";

function makeCategory(overrides: Partial<Category>): Category {
  const defaults: Category = {
    id: 1,
    name: "Test category",
    position: 0,
  };
  return { ...defaults, ...overrides };
}

const watching = makeCategory({ id: 1, name: "Watching", position: 0 });
const watchlist = makeCategory({ id: 2, name: "Watchlist", position: 1 });
const done = makeCategory({ id: 3, name: "Done", position: 2 });
const categories = [watching, watchlist, done];

describe("createCategory", () => {
  test("returns name Anime and position 3 (no id yet)", () => {
    expect(createCategory("Anime", 3)).toEqual({
      name: "Anime",
      position: 3,
    });
  });
});

describe("renameCategory", () => {
  test("renames Anime to Drama and keeps id 4 and position 2", () => {
    const category = makeCategory({ id: 4, name: "Anime", position: 2 });

    expect(renameCategory(category, "Drama")).toEqual({
      id: 4,
      name: "Drama",
      position: 2,
    });
  });
});

describe("reorderCategories", () => {
  test("moves Done to the front: Done 0, Watching 1, Watchlist 2", () => {
    expect(reorderCategories(categories, 3, 0)).toEqual([
      { ...done, position: 0 },
      { ...watching, position: 1 },
      { ...watchlist, position: 2 },
    ]);
  });

  test("returns the same list when no category has the id (99)", () => {
    expect(reorderCategories(categories, 99, 0)).toEqual(categories);
  });
});

describe("removeCategory", () => {
  test("removes Watchlist from the middle: Watching 0, Done 1", () => {
    expect(removeCategory(categories, 2)).toEqual([
      { ...watching, position: 0 },
      { ...done, position: 1 },
    ]);
  });

  test("returns the same list when no category has the id (99)", () => {
    expect(removeCategory(categories, 99)).toEqual(categories);
  });
});
