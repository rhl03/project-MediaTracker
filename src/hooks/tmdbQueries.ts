import { useQuery } from "@tanstack/react-query";
import {
  getMovieDetails,
  getSeason,
  getTvDetails,
  searchTitles,
} from "../tmdb/api";

const HOUR = 60 * 60 * 1000;

/** Movie details, fresh for 24 h. */
export function useMovieDetails(tmdbId: number) {
  return useQuery({
    queryKey: ["movie", tmdbId],
    queryFn: () => getMovieDetails(tmdbId),
    staleTime: 24 * HOUR,
  });
}

/** Series details, fresh for 6 h (new episodes and seasons get added). */
export function useTvDetails(tmdbId: number) {
  return useQuery({
    queryKey: ["tv", tmdbId],
    queryFn: () => getTvDetails(tmdbId),
    staleTime: 6 * HOUR,
  });
}

/** All episodes of one season, fresh for 24 h. */
export function useSeason(tmdbId: number, seasonNumber: number) {
  return useQuery({
    queryKey: ["season", tmdbId, seasonNumber],
    queryFn: () => getSeason(tmdbId, seasonNumber),
    staleTime: 24 * HOUR,
  });
}

/** Search results for a text. Not kept fresh: every search asks TMDB again. */
export function useSearchTitles(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchTitles(query),
  });
}
