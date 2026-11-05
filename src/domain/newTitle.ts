import type { LoadedDetails, NewTitle } from "./types";

/**
 * Turns the details loaded from TMDB into a new title to save when it is added.
 * A series gets its total episodes; a movie gets 0, since it uses "watched".
 * Every new title starts as not watched.
 */
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
