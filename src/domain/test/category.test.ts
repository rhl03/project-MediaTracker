import { createCategory } from "../category";

test("my test", () => {
  const name = "testtest";
  const position = 3;
  expect(createCategory(name, position)).toEqual("testtest", 3)
})
