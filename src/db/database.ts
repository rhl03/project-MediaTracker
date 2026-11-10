import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from "@op-engineering/op-sqlite";

const opsqliteDb = open({
  name: "mediaTrackerData",
});

opsqliteDb.executeSync("PRAGMA foreign_keys = ON");

/** The app's database. Import this everywhere instead of opening a new connection. */
export const db = drizzle(opsqliteDb);
