/** A movie or a series. */
export type MediaType = "movie" | "tv";

/** One episode by season and number, e.g. S2 E5. */
export type LatestEpisodeType = { seasonNumber: number; episodeNumber: number };

/** An episode in a season. airDate is null when unknown. */
export type Episode = LatestEpisodeType & {
  name: string;
  airDate: string | null;
};

/** The next episode that hasn't aired, always with a date. */
export type NextEpisode = LatestEpisodeType & { airDate: string };

/** A title in the library. Movies use watched; series use the counts. */
export type TrackedTitle = {
  id: number;
  tmdbId: number;
  watched: boolean;
  mediaType: MediaType;
  name: string;
  posterPath: string | null;
  totalEpisodes: number;
  watchedCount: number;
  addedAt: number;
  lastWatchedAt: number | null;
};

/** The poster badge: check, percent or nothing. */
export type Badge =
  | { kind: "check" }
  | { kind: "percent"; value: number }
  | { kind: "none" };

/** A season and how many episodes it has. */
export type SeasonSummary = {
  seasonNumber: number;
  name: string;
  episodeCount: number;
};

/** Series details in the app's own shape. */
export type TvDetails = {
  tmdbId: number;
  name: string;
  posterPath: string | null;
  overview: string;
  seasons: SeasonSummary[];
  totalEpisodes: number;
  nextEpisode: NextEpisode | null;
};

/** Movie details in the app's own shape. */
export type MovieDetails = {
  tmdbId: number;
  name: string;
  posterPath: string | null;
  overview: string;
  runtimeMinutes: number | null;
  releaseDate: string | null;
};

/** What the Details screen shows: a series or a movie. */
export type LoadedDetails =
  | { mediaType: "tv"; details: TvDetails }
  | { mediaType: "movie"; details: MovieDetails };

/** A title to save. No id yet; the database gives it one. */
export type NewTitle = Pick<
  TrackedTitle,
  "tmdbId" | "mediaType" | "name" | "posterPath" | "totalEpisodes" | "watched"
>;

/** A named list of titles. position is the Home tab order. */
export type Category = {
  id: number;
  name: string;
  position: number;
};

/** A category to save. No id yet; the database gives it one. */
export type NewCategory = Omit<Category, "id">;

/** Links one title to one category. */
export type TitleCategory = {
  titleId: number;
  categoryId: number;
};

/** One search hit from TMDB. year is null when TMDB has no date. */
export type SearchResult = {
  tmdbId: number;
  mediaType: MediaType;
  name: string;
  year: string | null;
  posterPath: string | null;
};
