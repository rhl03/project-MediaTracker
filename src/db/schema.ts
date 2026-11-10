import { sql } from "drizzle-orm";
import {
  check,
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

/** User-made lists shown as Home tabs, ordered by position. */
export const categoriesTable = sqliteTable("categories", {
  id: integer().primaryKey(),
  name: text().notNull(),
  position: integer().notNull(),
});

/** One row per tracked movie or series. Progress stays here even when it's in no category. */
export const titlesTable = sqliteTable(
  "titles",
  {
    id: integer().primaryKey(),
    tmdbId: integer("tmdb_id").notNull(),
    mediaType: text("media_type", { enum: ["movie", "tv"] }).notNull(),
    name: text().notNull(),
    posterPath: text("poster_path"),
    totalEpisodes: integer("total_episodes").notNull().default(0),
    watched: integer({ mode: "boolean" }).notNull().default(false),
    addedAt: integer("added_at").notNull(),
    lastWatchedAt: integer("last_watched_at"),
  },
  table => [
    unique().on(table.tmdbId, table.mediaType),
    check("media_type_check", sql`${table.mediaType} IN ('movie', 'tv')`),
  ],
);

/** One row per watched episode. Deleted together with its title. */
export const watchedEpisodesTable = sqliteTable(
  "watched_episodes",
  {
    titleId: integer("title_id")
      .notNull()
      .references(() => titlesTable.id, { onDelete: "cascade" }),
    seasonNumber: integer("season_number").notNull(),
    episodeNumber: integer("episode_number").notNull(),
    watchedAt: integer("watched_at").notNull(),
  },
  table => [
    primaryKey({
      columns: [table.titleId, table.seasonNumber, table.episodeNumber],
    }),
  ],
);

/** Links titles to categories. A title can be in several; links go when either side is deleted. */
export const titleCategoriesTable = sqliteTable(
  "title_categories",
  {
    titleId: integer("title_id")
      .notNull()
      .references(() => titlesTable.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "cascade" }),
  },
  table => [
    primaryKey({
      columns: [table.titleId, table.categoryId],
    }),
  ],
);

/** App settings as key–value pairs. */
export const settingsTable = sqliteTable("settings", {
  key: text().primaryKey(),
  value: text().notNull(),
});
