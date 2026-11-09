import z from "zod";
import { TMDB_API_KEY } from "../config/secrets";

/** All TMDB requests go to the v3 API. */
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/** Thrown when TMDB answers with an error status, e.g. 401 (bad key) or 404. */
export class TmdbError extends Error {
  status: number;

  constructor(status: number) {
    super(`TMDB request failed with status ${status}`);
    this.name = "TmdbError";
    this.status = status;
    Object.setPrototypeOf(this, TmdbError.prototype);
  }
}

/**
 * Sends a GET request to TMDB and returns the raw JSON (unknown until a schema checks it).
 * The built-in API key is always added; a caller's own api_key can't replace it.
 */
export async function getTmdb(
  path: string,
  params: Record<string, string> = {},
): Promise<unknown> {
  const query = Object.entries({ ...params, api_key: TMDB_API_KEY })
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

  const url = `${TMDB_BASE_URL}${path}?${query}`;

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new TmdbError(response.status);
  }

  return response.json();
}

/** Turns an error from a TMDB request into a short message for the screen. */
export function describeTmdbError(error: unknown): string {
  if (error instanceof TmdbError) {
    if (error.status === 401) {
      return "TMDB rejected the app's key. Update the app or try again later.";
    }
    return `TMDB had a problem (${error.status}). Try again later.`;
  }
  if (error instanceof z.ZodError) {
    return "TMDB sent data the app doesn't understand. Try again later.";
  }
  return "Could not reach TMDB. Check your connection.";
}
