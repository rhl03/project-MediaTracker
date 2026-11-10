import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

/** Creates an in-memory database and runs the migrations, like the app does at startup. */
export function makeDb() {
  const db = drizzle({ client: new Database(":memory:") });
  migrate(db, { migrationsFolder: "drizzle" });
  return db;
}
