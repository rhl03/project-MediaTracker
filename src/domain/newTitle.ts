import type { LoadedDetails, NewTitle } from "./types";

export function toNewTitle(loaded: LoadedDetails): NewTitle {
  switch (loaded.mediaType) {
    case "tv":
      return {
        tmdbId: loaded.details.tmdbId,
        mediaType: "tv",
        name: loaded.details.name,
        posterPath: loaded.details.posterPath,
        totalEpisodes: loaded.details.totalEpisodes,
        watched: false,
      };
    case "movie":
      return {
        tmdbId: loaded.details.tmdbId,
        mediaType: "movie",
        name: loaded.details.name,
        posterPath: loaded.details.posterPath,
        totalEpisodes: 0,
        watched: false,
      };
  }
}
