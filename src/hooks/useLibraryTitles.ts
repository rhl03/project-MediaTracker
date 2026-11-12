import type { SearchResult, TrackedTitle } from "../domain/types";
import { useSearchTitles } from "./tmdbQueries";

/** TEMPORARY: search term for the demo titles. */
const DEMO_QUERY = "star";

/** TEMPORARY: turns a search result into a tracked title with made-up progress. */
function toDemoTitle(result: SearchResult, index: number): TrackedTitle {
  const isMovie = result.mediaType === "movie";
  const totalEpisodes = isMovie ? 0 : 8 + (index % 4) * 6;
  const watchedCount = isMovie ? 0 : (index * 7) % (totalEpisodes + 1);

  return {
    id: index + 1,
    tmdbId: result.tmdbId,
    watched: isMovie && index % 2 === 0,
    mediaType: result.mediaType,
    name: result.name,
    posterPath: result.posterPath,
    totalEpisodes,
    watchedCount,
    addedAt: 0,
    lastWatchedAt: null,
  };
}

/** Titles for the Library grid. TEMPORARY: demo data from TMDB until the database is connected. */
export function useLibraryTitles(): {
  titles: TrackedTitle[];
  loading: boolean;
} {
  const search = useSearchTitles(DEMO_QUERY);
  const titles = search.data ? search.data.map(toDemoTitle) : [];
  return { titles, loading: search.isPending };
}
