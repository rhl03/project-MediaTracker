import {
  Episode,
  MovieDetails,
  SearchResult,
  TvDetails,
} from "../domain/types";
import { getTmdb } from "./client";
import {
  mapMovieDetails,
  mapSearchResults,
  mapSeason,
  mapTvDetails,
} from "./map";
import {
  tmdbMovieDetailsSchema,
  tmdbSearchResponseSchema,
  tmdbSeasonDetailsSchema,
  tmdbTvDetailsSchema,
} from "./schemas";

/** Searches TMDB for movies and series. Empty text returns [] without a request. */
export async function searchTitles(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (trimmed === "") {
    return [];
  }
  const raw = await getTmdb("/search/multi", { query: trimmed });
  const result = tmdbSearchResponseSchema.parse(raw);
  return mapSearchResults(result);
}

/** Loads a series' details: seasons (without specials), total episodes, next episode. */
export async function getTvDetails(tmdbId: number): Promise<TvDetails> {
  const raw = await getTmdb(`/tv/${tmdbId}`);
  const result = tmdbTvDetailsSchema.parse(raw);
  return mapTvDetails(result);
}

/** Loads all episodes of one season of a series. */
export async function getSeason(
  tmdbId: number,
  seasonNumber: number,
): Promise<Episode[]> {
  const raw = await getTmdb(`/tv/${tmdbId}/season/${seasonNumber}`);
  const result = tmdbSeasonDetailsSchema.parse(raw);
  return mapSeason(result);
}

/** Loads a movie's details. */
export async function getMovieDetails(tmdbId: number): Promise<MovieDetails> {
  const raw = await getTmdb(`/movie/${tmdbId}`);
  const result = tmdbMovieDetailsSchema.parse(raw);
  return mapMovieDetails(result);
}
