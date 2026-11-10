import type { SQLiteAsyncDatabase } from "drizzle-orm/sqlite-core";

/** Any Drizzle SQLite database: op-sqlite in the app, better-sqlite3 in tests. */
export type AppDb = SQLiteAsyncDatabase<"sync" | "async", unknown>;
