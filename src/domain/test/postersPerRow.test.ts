import {
  DEFAULT_POSTERS_PER_ROW,
  MAX_POSTERS_PER_ROW,
  MIN_POSTERS_PER_ROW,
  parsePostersPerRow,
} from "../postersPerRow";

describe("parsePostersPerRow", () => {
  it("returns the number for a saved whole number in range", () => {
    expect(parsePostersPerRow("3")).toBe(3);
  });

  it("returns the default for a missing value", () => {
    expect(parsePostersPerRow(undefined)).toBe(DEFAULT_POSTERS_PER_ROW);
  });

  it("returns the default for empty text", () => {
    expect(parsePostersPerRow(" ")).toBe(DEFAULT_POSTERS_PER_ROW);
  });

  it("returns the default for text that isn't a whole number", () => {
    expect(parsePostersPerRow("abc")).toBe(DEFAULT_POSTERS_PER_ROW);
    expect(parsePostersPerRow("3.5")).toBe(DEFAULT_POSTERS_PER_ROW);
  });

  it("returns the nearest limit for numbers out of range", () => {
    expect(parsePostersPerRow("1")).toBe(MIN_POSTERS_PER_ROW);
    expect(parsePostersPerRow("9")).toBe(MAX_POSTERS_PER_ROW);
  });
});
