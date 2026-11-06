import { z } from "zod";

// Types made from the schemas below.
export type TmdbMovieDetails = z.infer<typeof tmdbMovieDetailsSchema>;
export type TmdbTvDetails = z.infer<typeof tmdbTvDetailsSchema>;
export type TmdbSeasonDetails = z.infer<typeof tmdbSeasonDetailsSchema>;
export type TmdbSearchResponse = z.infer<typeof tmdbSearchResponseSchema>;

/** A season in a series' season list. */
export const tmdbSeasonSchema = z.object({
  season_number: z.number(),
  name: z.string(),
  episode_count: z.number(),
});

/** The next episode that hasn't aired yet. */
export const tmdbNextEpisodeSchema = z.object({
  season_number: z.number(),
  episode_number: z.number(),
  air_date: z.string(),
});

/** An episode in a season. air_date is null when unknown. */
export const tmdbEpisodeSchema = z.object({
  season_number: z.number(),
  episode_number: z.number(),
  name: z.string(),
  air_date: z.string().nullable(),
});

/** GET /tv/{id}/season/{number} */
export const tmdbSeasonDetailsSchema = z.object({
  season_number: z.number(),
  episodes: z.array(tmdbEpisodeSchema),
});

/** A movie in search results. */
export const tmdbSearchMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  release_date: z.string().optional(),
  poster_path: z.string().nullable(),
  media_type: z.literal("movie"),
});

/** A series in search results. */
export const tmdbSearchTvSchema = z.object({
  id: z.number(),
  name: z.string(),
  first_air_date: z.string().optional(),
  poster_path: z.string().nullable(),
  media_type: z.literal("tv"),
});

/** A person in search results (not shown in the app). */
export const tmdbSearchPersonSchema = z.object({
  id: z.number(),
  name: z.string(),
  media_type: z.literal("person"),
});

/** A movie, series or person, picked by media_type. */
export const tmdbSearchItemSchema = z.discriminatedUnion("media_type", [
  tmdbSearchMovieSchema,
  tmdbSearchTvSchema,
  tmdbSearchPersonSchema,
]);

/** GET /search/multi */
export const tmdbSearchResponseSchema = z.object({
  page: z.number(),
  results: z.array(tmdbSearchItemSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

/** GET /movie/{id} */
export const tmdbMovieDetailsSchema = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  runtime: z.number().nullable(),
  release_date: z.string(),
});

/** GET /tv/{id} */
export const tmdbTvDetailsSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  seasons: z.array(tmdbSeasonSchema),
  next_episode_to_air: tmdbNextEpisodeSchema.nullable(),
});
