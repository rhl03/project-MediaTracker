import { z } from "zod";
import { TmdbError, describeTmdbError } from "../client";

describe("describeTmdbError", () => {
  test("returns the key message for a 401 (key wrong or revoked)", () => {
    expect(describeTmdbError(new TmdbError(401))).toBe(
      "TMDB rejected the app's key. Update the app or try again later.",
    );
  });

  test("returns the status for any other TmdbError (500)", () => {
    expect(describeTmdbError(new TmdbError(500))).toBe(
      "TMDB had a problem (500). Try again later.",
    );
  });

  test("returns the data message for a ZodError (broken response)", () => {
    expect(describeTmdbError(new z.ZodError([]))).toBe(
      "TMDB sent data the app doesn't understand. Try again later.",
    );
  });

  test("returns the connection message for anything else (TypeError)", () => {
    expect(describeTmdbError(new TypeError("Network request failed"))).toBe(
      "Could not reach TMDB. Check your connection.",
    );
  });
});
