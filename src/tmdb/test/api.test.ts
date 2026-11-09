import movie603Json from "../__fixtures__/movie-603.json";
import searchMatrixJson from "../__fixtures__/search-matrix.json";
import { getMovieDetails, searchTitles } from "../api";
import { TmdbError } from "../client";

jest.mock("../../config/secrets", () => ({ TMDB_API_KEY: "test-key" }));

const fetchMock = jest.fn();
globalThis.fetch = fetchMock;

function answer(body: unknown, status = 200) {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
}

afterEach(() => {
  fetchMock.mockReset();
});

describe("searchTitles", () => {
  test("returns [] for empty text without calling TMDB", async () => {
    expect(await searchTitles("   ")).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("returns mapped results for the real Matrix search", async () => {
    answer(searchMatrixJson);
    const results = await searchTitles("matrix");
    expect(results.find(r => r.tmdbId === 603)?.name).toBe("The Matrix");
  });

  test("sends the query and the built-in key in the URL", async () => {
    answer(searchMatrixJson);
    await searchTitles("matrix");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/search/multi?query=matrix&api_key=test-key",
      expect.anything(),
    );
  });
});

describe("getMovieDetails", () => {
  test("returns The Matrix with runtime 136 from the real response", async () => {
    answer(movie603Json);
    const movie = await getMovieDetails(603);
    expect(movie.name).toBe("The Matrix");
    expect(movie.runtimeMinutes).toBe(136);
  });

  test("throws a TmdbError when TMDB answers 404", async () => {
    answer({}, 404);
    await expect(getMovieDetails(603)).rejects.toThrow(TmdbError);
  });

  test("throws when TMDB sends data that doesn't match the schema", async () => {
    answer({ ...movie603Json, id: "603" });
    await expect(getMovieDetails(603)).rejects.toThrow();
  });
});
