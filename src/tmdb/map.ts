import type {
  Episode,
  MovieDetails,
  SearchResult,
  TvDetails,
} from "../domain/types";
import {
  TmdbMovieDetails,
  TmdbSearchResponse,
  TmdbSeasonDetails,
  TmdbTvDetails,
} from "./schemas";

/** TMDB movie details → the app's MovieDetails. */
export function mapMovieDetails(raw: TmdbMovieDetails): MovieDetails {
  return {
    tmdbId: raw.id,
    name: raw.title,
    posterPath: raw.poster_path,
    overview: raw.overview,
    runtimeMinutes: raw.runtime,
    releaseDate: raw.release_date,
  };
}

/** "1999-03-31" → "1999". Null when the date is missing or empty. */
function dateHelper(date: string | undefined): string | null {
  if (!date) {
    return null;
  }
  return date.slice(0, 4);
}

/** TMDB search results → SearchResult list. People are left out. */
export function mapSearchResults(raw: TmdbSearchResponse): SearchResult[] {
  return raw.results
    .filter(item => item.media_type !== "person")
    .map(
      (item): SearchResult =>
        item.media_type === "movie"
          ? {
              tmdbId: item.id,
              mediaType: "movie",
              name: item.title,
              year: dateHelper(item.release_date),
              posterPath: item.poster_path,
            }
          : {
              tmdbId: item.id,
              mediaType: "tv",
              name: item.name,
              year: dateHelper(item.first_air_date),
              posterPath: item.poster_path,
            },
    );
}

/** TMDB series details → TvDetails. Season 0 (specials) is skipped and not counted. */
export function mapTvDetails(raw: TmdbTvDetails): TvDetails {
  const seasons = raw.seasons
    .filter(season => season.season_number !== 0)
    .map(season => ({
      seasonNumber: season.season_number,
      name: season.name,
      episodeCount: season.episode_count,
    }));

  let totalEpisodes = 0;
  for (const season of seasons) {
    totalEpisodes += season.episodeCount;
  }

  const next = raw.next_episode_to_air;
  const nextEpisode =
    next === null
      ? null
      : {
          seasonNumber: next.season_number,
          episodeNumber: next.episode_number,
          airDate: next.air_date,
        };

  return {
    tmdbId: raw.id,
    name: raw.name,
    posterPath: raw.poster_path,
    overview: raw.overview,
    seasons,
    totalEpisodes,
    nextEpisode,
  };
}

/** TMDB season details → Episode list. An empty air date becomes null. */
export function mapSeason(raw: TmdbSeasonDetails): Episode[] {
  const episodes = raw.episodes.map(episode => ({
    seasonNumber: episode.season_number,
    episodeNumber: episode.episode_number,
    name: episode.name,
    airDate: episode.air_date || null,
  }));
  return episodes;
}
