import movieRaw from "../__fixtures__/movie-603.json";
import searchRaw from "../__fixtures__/search-matrix.json";
import seasonRaw from "../__fixtures__/tv-1396-season-1.json";
import tvRaw from "../__fixtures__/tv-1396.json";
import {
  tmdbMovieDetailsSchema,
  tmdbSearchResponseSchema,
  tmdbSeasonDetailsSchema,
  tmdbTvDetailsSchema,
} from "../schemas";

describe("tmdbMovieDetailsSchema", () => {
  test("accepts the real TMDB response for The Matrix (603)", () => {
    const movie = tmdbMovieDetailsSchema.parse(movieRaw);
    expect(movie.title).toBe("The Matrix");
  });

  test("rejects id 603 as text instead of a number", () => {
    const result = tmdbMovieDetailsSchema.safeParse({ ...movieRaw, id: "603" });
    expect(result.success).toBe(false);
  });
});

describe("tmdbTvDetailsSchema", () => {
  test("accepts the real TMDB response for Breaking Bad (1396)", () => {
    const tv = tmdbTvDetailsSchema.parse(tvRaw);
    expect(tv.name).toBe("Breaking Bad");
  });

  test("accepts a series with a next episode planned", () => {
    const result = tmdbTvDetailsSchema.safeParse({
      ...tvRaw,
      next_episode_to_air: {
        season_number: 6,
        episode_number: 1,
        air_date: "2026-12-01",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("tmdbSeasonDetailsSchema", () => {
  test("accepts the real season 1 of Breaking Bad with 7 episodes", () => {
    const season = tmdbSeasonDetailsSchema.parse(seasonRaw);
    expect(season.episodes.length).toBe(7);
  });

  test("accepts an episode with no air date (null)", () => {
    const result = tmdbSeasonDetailsSchema.safeParse({
      ...seasonRaw,
      episodes: [
        { season_number: 1, episode_number: 1, name: "Pilot", air_date: null },
      ],
    });
    expect(result.success).toBe(true);
  });
});

describe("tmdbSearchResponseSchema", () => {
  test("accepts the real search for Matrix, first result a movie", () => {
    const search = tmdbSearchResponseSchema.parse(searchRaw);
    expect(search.results[0]?.media_type).toBe("movie");
  });

  test("rejects a result with an unknown media_type (collection)", () => {
    const result = tmdbSearchResponseSchema.safeParse({
      ...searchRaw,
      results: [{ id: 1, name: "Matrix Collection", media_type: "collection" }],
    });
    expect(result.success).toBe(false);
  });
});
