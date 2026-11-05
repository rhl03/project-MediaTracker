import { createCategory, renameCategory } from "../category";
import { Category } from "../types";

test("my test", () => {
  const name = "testtest";
  const position = 3;
  expect(createCategory(name, position)).toEqual({
    name: "testtest",
    position: 3,
  });
});

test("renames Anime to Drama and keeps id 4 and position 2", () => {
  const category: Category = { id: 4, name: "Anime", position: 2 };

  expect(renameCategory(category, "Drama")).toEqual({
    id: 4,
    name: "Drama",
    position: 2,
  });
});
