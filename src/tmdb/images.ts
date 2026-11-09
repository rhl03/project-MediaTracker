/** The poster widths TMDB offers, in pixels (w92 = 92 px wide). */
export type PosterType = "w92" | "w154" | "w185" | "w342" | "w500" | "w780";

/** Base URL for all TMDB images. */
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

/** Full poster URL for a size, e.g. ".../w342/abc.jpg". Null when the title has no poster. */
export function posterUrl(
  posterPath: string | null,
  size: PosterType,
): string | null {
  if (posterPath === null) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}
