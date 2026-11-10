import { settingsTable } from "../../schema";
import { deleteSetting, getSetting, setSetting } from "../settings";
import { makeDb } from "../../test/makeDb";

describe("getSetting", () => {
  test("returns undefined for a setting that was never set", async () => {
    const db = makeDb();

    expect(await getSetting(db, "postersPerRow")).toBeUndefined();
  });
});

describe("setSetting", () => {
  test("returns 4 from getSetting after saving postersPerRow as 4", async () => {
    const db = makeDb();

    await setSetting(db, "postersPerRow", "4");

    expect(await getSetting(db, "postersPerRow")).toBe("4");
  });

  test("overwrites 4 with 6 and keeps one row for postersPerRow", async () => {
    const db = makeDb();

    await setSetting(db, "postersPerRow", "4");
    await setSetting(db, "postersPerRow", "6");

    expect(await getSetting(db, "postersPerRow")).toBe("6");
    expect(db.select().from(settingsTable).all()).toHaveLength(1);
  });

  test("keeps other settings when one is overwritten", async () => {
    const db = makeDb();
    await setSetting(db, "postersPerRow", "4");
    await setSetting(db, "theme", "dark");

    await setSetting(db, "postersPerRow", "6");

    expect(await getSetting(db, "theme")).toBe("dark");
  });
});

describe("deleteSetting", () => {
  test("returns undefined from getSetting after deleting postersPerRow", async () => {
    const db = makeDb();
    await setSetting(db, "postersPerRow", "4");

    await deleteSetting(db, "postersPerRow");

    expect(await getSetting(db, "postersPerRow")).toBeUndefined();
  });

  test("keeps other settings", async () => {
    const db = makeDb();
    await setSetting(db, "postersPerRow", "4");
    await setSetting(db, "theme", "dark");

    await deleteSetting(db, "postersPerRow");

    expect(await getSetting(db, "theme")).toBe("dark");
  });

  test("does nothing for a setting that doesn't exist", async () => {
    const db = makeDb();
    await setSetting(db, "theme", "dark");

    await deleteSetting(db, "postersPerRow");

    expect(db.select().from(settingsTable).all()).toHaveLength(1);
  });
});
