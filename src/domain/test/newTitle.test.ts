import { toNewTitle } from "../newTitle";
import type { MovieDetails, TvDetails } from "../types";

function makeTvDetails(overrides: Partial<TvDetails>): TvDetails {
  const defaults: TvDetails = {
    tmdbId: 1396,
    name: "Test show",
    posterPath: "/show.jpg",
    overview: "",
    seasons: [],
    totalEpisodes: 10,
    nextEpisode: null,
  };
  return { ...defaults, ...overrides };
}

function makeMovieDetails(overrides: Partial<MovieDetails>): MovieDetails {
  const defaults: MovieDetails = {
    tmdbId: 603,
    name: "Test movie",
    posterPath: "/movie.jpg",
    overview: "",
    runtimeMinutes: 120,
    releaseDate: "1999-03-31",
  };
  return { ...defaults, ...overrides };
}

describe("toNewTitle", () => {
  describe("series", () => {
    test("returns id 1396, name, poster and 62 episodes for a series with 62 episodes", () => {
      const details = makeTvDetails({ totalEpisodes: 62 });

      expect(toNewTitle({ mediaType: "tv", details })).toEqual({
        tmdbId: 1396,
        mediaType: "tv",
        name: "Test show",
        posterPath: "/show.jpg",
        totalEpisodes: 62,
        watched: false,
      });
    });

    test("returns 0 episodes for a series with no episodes yet (total 0)", () => {
      const details = makeTvDetails({ totalEpisodes: 0 });

      expect(toNewTitle({ mediaType: "tv", details }).totalEpisodes).toBe(0);
    });

    test("keeps posterPath null when the series has no poster", () => {
      const details = makeTvDetails({ posterPath: null });

      expect(toNewTitle({ mediaType: "tv", details }).posterPath).toBeNull();
    });

    test("leaves out overview, seasons and nextEpisode (only the title fields)", () => {
      const details = makeTvDetails({
        overview: "A teacher turns to crime.",
        seasons: [{ seasonNumber: 1, name: "Season 1", episodeCount: 7 }],
        nextEpisode: { seasonNumber: 2, episodeNumber: 1, airDate: "2026-12-01" },
      });

      expect(Object.keys(toNewTitle({ mediaType: "tv", details })).sort()).toEqual(
        ["mediaType", "name", "posterPath", "tmdbId", "totalEpisodes", "watched"],
      );
    });
  });

  describe("movie", () => {
    test("returns id 603, name, poster, 0 episodes and not watched for a movie", () => {
      const details = makeMovieDetails({});

      expect(toNewTitle({ mediaType: "movie", details })).toEqual({
        tmdbId: 603,
        mediaType: "movie",
        name: "Test movie",
        posterPath: "/movie.jpg",
        totalEpisodes: 0,
        watched: false,
      });
    });

    test("keeps posterPath null when the movie has no poster", () => {
      const details = makeMovieDetails({ posterPath: null });

      expect(toNewTitle({ mediaType: "movie", details }).posterPath).toBeNull();
    });

    test("leaves out overview, runtime and release date (only the title fields)", () => {
      const details = makeMovieDetails({
        overview: "A hacker learns the truth.",
        runtimeMinutes: 136,
      });

      expect(
        Object.keys(toNewTitle({ mediaType: "movie", details })).sort(),
      ).toEqual([
        "mediaType",
        "name",
        "posterPath",
        "tmdbId",
        "totalEpisodes",
        "watched",
      ]);
    });
  });
});
