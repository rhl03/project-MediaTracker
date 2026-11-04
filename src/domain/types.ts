export type MediaType = "movie" | "tv";

export type LatestEpisodeType = { seasonNumber: number; episodeNumber: number };

export type Episode = LatestEpisodeType & {
  name: string;
  airDate: string | null;
};

export type NextEpisode = LatestEpisodeType & { airDate: string };

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

export type Badge =
  | { kind: "check" }
  | { kind: "percent"; value: number }
  | { kind: "none" };

export type SeasonSummary = {
  seasonNumber: number;
  name: string;
  episodeCount: number;
};

export type TvDetails = {
  tmdbId: number;
  name: string;
  posterPath: string | null;
  overview: string;
  seasons: SeasonSummary[];
  totalEpisodes: number;
  nextEpisode: NextEpisode | null;
};

export type MovieDetails = {
  tmdbId: number;
  name: string;
  posterPath: string | null;
  overview: string;
  runtimeMinutes: number | null;
  releaseDate: string | null;
};

export type LoadedDetails =
  | { mediaType: "tv"; details: TvDetails }
  | { mediaType: "movie"; details: MovieDetails };

export type NewTitle = Pick<
  TrackedTitle,
  "tmdbId" | "mediaType" | "name" | "posterPath" | "totalEpisodes" | "watched"
>;

export type Category = {
  id: number;
  name: string;
  position: number;
};

export type NewCategory = Omit<Category, "id">;
