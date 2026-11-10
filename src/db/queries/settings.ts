import { eq } from "drizzle-orm";
import { settingsTable } from "../schema";
import type { AppDb } from "../types";

/** Returns the saved value for a setting, or undefined if it was never set. */
export async function getSetting(
  db: AppDb,
  key: string,
): Promise<string | undefined> {
  const result = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, key));
  return result[0]?.value;
}

/** Saves a setting, or overwrites it if it already exists. */
export async function setSetting(db: AppDb, key: string, value: string) {
  await db
    .insert(settingsTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value } });
}

/** Removes a setting, so getSetting returns undefined for it again. */
export async function deleteSetting(db: AppDb, key: string) {
  await db.delete(settingsTable).where(eq(settingsTable.key, key));
}
