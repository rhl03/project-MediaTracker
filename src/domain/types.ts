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
