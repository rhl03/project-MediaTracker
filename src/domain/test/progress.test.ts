import {
  airedEpisodes,
  episodesUpTo,
  formatNextEpisode,
  isAired,
  isoDate,
  latestEpisode,
  nextToWatch,
  progressBadge,
  progressLabel,
  progressPercent,
  shortDate,
} from "../progress";
import { TrackedTitle } from "../types";

function makeTitle(overrides: Partial<TrackedTitle>): TrackedTitle {
  const defaults: TrackedTitle = {
    id: 1,
    tmdbId: 1396,
    watched: false,
    mediaType: "tv",
    name: "Test show",
    posterPath: null,
    totalEpisodes: 10,
    watchedCount: 0,
    addedAt: 0,
    lastWatchedAt: null,
  };
  return { ...defaults, ...overrides };
}

describe("progressPercent", () => {
  test("returns 25 when 5 of 20 are watched", () => {
    const watched = 5;
    const total = 20;
    expect(progressPercent(watched, total)).toBe(25);
  });
  test("rounds down: returns 33 when 1 of 3 is watched", () => {
    const watched = 1;
    const total = 3;
    expect(progressPercent(watched, total)).toBe(33);
  });

  test("rounds up: returns 67 when 2 of 3 are watched", () => {
    const watched = 2;
    const total = 3;
    expect(progressPercent(watched, total)).toBe(67);
  });

  test("returns 0 when nothing is watched and total is 0", () => {
    const watched = 0;
    const total = 0;
    expect(progressPercent(watched, total)).toBe(0);
  });

  test("returns 0 when total is 0, even if episodes are watched", () => {
    const watched = 6;
    const total = 0;
    expect(progressPercent(watched, total)).toBe(0);
  });

  test("caps at 100 when more are watched than the total", () => {
    const watched = 30;
    const total = 24;
    expect(progressPercent(watched, total)).toBe(100);
  });
});

describe("latestEpisode", () => {
  test("returns S2E3 from S1E10, S2E3, S2E1 (later season wins, then higher episode)", () => {
    const watched = [
      { seasonNumber: 1, episodeNumber: 10 },
      { seasonNumber: 2, episodeNumber: 3 },
      { seasonNumber: 2, episodeNumber: 1 },
    ];
    expect(latestEpisode(watched)).toEqual({
      seasonNumber: 2,
      episodeNumber: 3,
    });
  });

  test("returns null when no episodes are watched", () => {
    const watched: { seasonNumber: number; episodeNumber: number }[] = [];
    expect(latestEpisode(watched)).toBeNull();
  });

  test("returns that episode when only one is watched", () => {
    const watched = [{ seasonNumber: 1, episodeNumber: 1 }];
    expect(latestEpisode(watched)).toEqual({
      seasonNumber: 1,
      episodeNumber: 1,
    });
  });
});

describe("progressLabel", () => {
  test("returns S2 E5 for season 2, episode 5", () => {
    expect(progressLabel({ seasonNumber: 2, episodeNumber: 5 })).toBe("S2 E5");
  });

  test("returns Not started when there is no episode (null)", () => {
    expect(progressLabel(null)).toBe("Not started");
  });
});

describe("progressBadge", () => {
  test("shows a check mark for a movie that is watched", () => {
    expect(
      progressBadge(makeTitle({ mediaType: "movie", watched: true })),
    ).toEqual({ kind: "check" });
  });

  test("shows nothing for a movie that is not watched", () => {
    expect(progressBadge(makeTitle({ mediaType: "movie" }))).toEqual({
      kind: "none",
    });
  });

  test("shows a check mark for a series with every episode watched", () => {
    expect(
      progressBadge(makeTitle({ watchedCount: 10, totalEpisodes: 10 })),
    ).toEqual({ kind: "check" });
  });

  test("shows a check mark when more episodes are watched than the total", () => {
    expect(
      progressBadge(makeTitle({ watchedCount: 12, totalEpisodes: 10 })),
    ).toEqual({ kind: "check" });
  });

  test("shows 25% for a series with 6 of 24 watched", () => {
    expect(
      progressBadge(makeTitle({ watchedCount: 6, totalEpisodes: 24 })),
    ).toEqual({ kind: "percent", value: 25 });
  });

  test("shows nothing for a series with 0 watched", () => {
    expect(progressBadge(makeTitle({ watchedCount: 0 }))).toEqual({
      kind: "none",
    });
  });

  test("shows nothing for a series with no episodes (total 0)", () => {
    expect(
      progressBadge(makeTitle({ watchedCount: 0, totalEpisodes: 0 })),
    ).toEqual({ kind: "none" });
  });

  test("ignores watched for a series: shows nothing at 0 episodes watched", () => {
    expect(
      progressBadge(makeTitle({ watched: true, watchedCount: 0 })),
    ).toEqual({ kind: "none" });
  });
});

describe("episodesUpTo", () => {
  const seasons = [
    { seasonNumber: 1, name: "Season 1", episodeCount: 3 },
    { seasonNumber: 2, name: "Season 2", episodeCount: 4 },
    { seasonNumber: 3, name: "Season 3", episodeCount: 5 },
  ];

  test("returns all of S1 plus S2 E1–E2 for S2 E2 (later seasons skipped)", () => {
    const episodes = episodesUpTo(seasons, {
      seasonNumber: 2,
      episodeNumber: 2,
    });

    expect(episodes).toEqual([
      { seasonNumber: 1, episodeNumber: 1 },
      { seasonNumber: 1, episodeNumber: 2 },
      { seasonNumber: 1, episodeNumber: 3 },
      { seasonNumber: 2, episodeNumber: 1 },
      { seasonNumber: 2, episodeNumber: 2 },
    ]);
  });

  test("returns only S1 E1 for S1 E1", () => {
    expect(
      episodesUpTo(seasons, { seasonNumber: 1, episodeNumber: 1 }),
    ).toEqual([{ seasonNumber: 1, episodeNumber: 1 }]);
  });
});

describe("nextToWatch", () => {
  const seasons = [
    { seasonNumber: 1, name: "Season 1", episodeCount: 3 },
    { seasonNumber: 2, name: "Season 2", episodeCount: 4 },
  ];

  test("returns S1 E1 when nothing is watched", () => {
    expect(nextToWatch(seasons, [])).toEqual({
      seasonNumber: 1,
      episodeNumber: 1,
    });
  });

  test("returns S1 E3 after S1 E2 (next episode in the same season)", () => {
    expect(
      nextToWatch(seasons, [{ seasonNumber: 1, episodeNumber: 2 }]),
    ).toEqual({ seasonNumber: 1, episodeNumber: 3 });
  });

  test("returns S2 E1 after S1 E3 (last episode of the season)", () => {
    expect(
      nextToWatch(seasons, [{ seasonNumber: 1, episodeNumber: 3 }]),
    ).toEqual({ seasonNumber: 2, episodeNumber: 1 });
  });

  test("returns null after S2 E4 (last episode of the series)", () => {
    expect(
      nextToWatch(seasons, [{ seasonNumber: 2, episodeNumber: 4 }]),
    ).toBeNull();
  });
});

describe("isoDate", () => {
  test("returns 2026-01-07 for 7 Jan 2026 (pads month and day with 0)", () => {
    expect(isoDate(new Date(2026, 0, 7))).toBe("2026-01-07");
  });
});

describe("isAired", () => {
  test("returns true for a date before today", () => {
    expect(isAired("2026-10-07", "2026-10-14")).toBe(true);
  });

  test("returns false for today (not aired yet)", () => {
    expect(isAired("2026-10-14", "2026-10-14")).toBe(false);
  });

  test("returns false for a date after today", () => {
    expect(isAired("2026-10-21", "2026-10-14")).toBe(false);
  });

  test("returns false when there is no date (null)", () => {
    expect(isAired(null, "2026-10-14")).toBe(false);
  });
});

describe("shortDate", () => {
  test("returns 7 Oct for 2026-10-07 (no leading 0)", () => {
    expect(shortDate("2026-10-07")).toBe("7 Oct");
  });
});

describe("formatNextEpisode", () => {
  const next = { seasonNumber: 3, episodeNumber: 4, airDate: "2026-10-18" };

  test("returns Next: S3 E4 · 18 Oct for a date after today", () => {
    expect(formatNextEpisode(next, "2026-10-12")).toBe("Next: S3 E4 · 18 Oct");
  });

  test("returns null for a date before today (already aired)", () => {
    expect(
      formatNextEpisode({ ...next, airDate: "2026-10-01" }, "2026-10-12"),
    ).toBeNull();
  });

  test("returns the text for today (not aired yet)", () => {
    expect(
      formatNextEpisode({ ...next, airDate: "2026-10-12" }, "2026-10-12"),
    ).toBe("Next: S3 E4 · 12 Oct");
  });

  test("returns null when there is no next episode (null)", () => {
    expect(formatNextEpisode(null, "2026-10-12")).toBeNull();
  });

  test("returns 5 Nov for 2026-11-05 (no leading 0 on the day)", () => {
    expect(
      formatNextEpisode({ ...next, airDate: "2026-11-05" }, "2026-10-12"),
    ).toBe("Next: S3 E4 · 5 Nov");
  });
});

describe("airedEpisodes", () => {
  const episodes = [
    { seasonNumber: 1, episodeNumber: 1, name: "Pilot", airDate: "2026-10-01" },
    { seasonNumber: 1, episodeNumber: 2, name: "Two", airDate: "2026-10-08" },
    { seasonNumber: 1, episodeNumber: 3, name: "Three", airDate: "2026-10-12" },
    { seasonNumber: 1, episodeNumber: 4, name: "Four", airDate: "2026-10-19" },
    { seasonNumber: 1, episodeNumber: 5, name: "Five", airDate: null },
  ];

  test("returns only S1 E1 and S1 E2 (before today; today, future and no date are left out)", () => {
    expect(airedEpisodes(episodes, "2026-10-12")).toEqual([
      { seasonNumber: 1, episodeNumber: 1 },
      { seasonNumber: 1, episodeNumber: 2 },
    ]);
  });

  test("returns every episode with a date when today is after all of them", () => {
    expect(airedEpisodes(episodes, "2026-12-01")).toEqual([
      { seasonNumber: 1, episodeNumber: 1 },
      { seasonNumber: 1, episodeNumber: 2 },
      { seasonNumber: 1, episodeNumber: 3 },
      { seasonNumber: 1, episodeNumber: 4 },
    ]);
  });

  test("returns an empty list when nothing has aired yet", () => {
    expect(airedEpisodes(episodes, "2026-09-01")).toEqual([]);
  });

  test("returns an empty list for no episodes", () => {
    expect(airedEpisodes([], "2026-10-12")).toEqual([]);
  });
});
