import {
  Badge,
  Episode,
  LatestEpisodeType,
  NextEpisode,
  SeasonSummary,
  TrackedTitle,
} from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Returns the watched percent (0–100), rounded and capped at 100.
 * Returns 0 when total is 0 or less.
 */
export function progressPercent(watched: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(Math.round((watched / total) * 100), 100);
}

/**
 * Returns the furthest watched episode, or null if the list is empty.
 * A later season wins first, then the higher episode (S2E1 beats S1E10).
 */
export function latestEpisode(
  watched: readonly LatestEpisodeType[],
): LatestEpisodeType | null {
  let latest: LatestEpisodeType | null = null;
  for (const ref of watched) {
    if (
      latest === null ||
      ref.seasonNumber > latest.seasonNumber ||
      (ref.seasonNumber === latest.seasonNumber &&
        ref.episodeNumber > latest.episodeNumber)
    ) {
      latest = ref;
    }
  }
  return latest;
}

/**
 * Turns an episode into a short label like "S2 E5", or "not started" if there is none.
 */
export function progressLabel(latest: LatestEpisodeType | null): string {
  if (latest === null) {
    return "Not started";
  }
  return `S${latest.seasonNumber} E${latest.episodeNumber}`;
}

/**
 * Picks the badge for a title's poster: a check mark for a watched movie or a
 * fully watched series, otherwise the watched percent (nothing at 0%).
 */
export function progressBadge(title: TrackedTitle): Badge {
  if (title.mediaType === "movie") {
    return title.watched ? { kind: "check" } : { kind: "none" };
  }
  const percent = progressPercent(title.watchedCount, title.totalEpisodes);
  if (percent === 0) {
    return { kind: "none" };
  }
  if (percent === 100) {
    return { kind: "check" };
  }
  return { kind: "percent", value: percent };
}

/**
 * Returns every episode from S1 E1 up to and including the target, so marking
 * an episode also marks all earlier ones. Seasons after the target are skipped.
 */
export function episodesUpTo(
  seasons: readonly SeasonSummary[],
  target: LatestEpisodeType,
): LatestEpisodeType[] {
  const refs: LatestEpisodeType[] = [];
  for (const season of seasons) {
    if (season.seasonNumber > target.seasonNumber) {
      continue;
    }
    const last =
      season.seasonNumber === target.seasonNumber
        ? target.episodeNumber
        : season.episodeCount;
    for (let episode = 1; episode <= last; episode++) {
      refs.push({ seasonNumber: season.seasonNumber, episodeNumber: episode });
    }
  }
  return refs;
}

/**
 * Returns the episode to watch next: S1 E1 when nothing is watched, the next
 * episode in the same season, or E1 of the next season. Null when done.
 */
export function nextToWatch(
  seasons: readonly SeasonSummary[],
  watched: readonly LatestEpisodeType[],
): LatestEpisodeType | null {
  const first = seasons[0];
  const latest = latestEpisode(watched);

  if (latest === null) {
    return first !== undefined
      ? { seasonNumber: first.seasonNumber, episodeNumber: 1 }
      : null;
  }

  const index = seasons.findIndex(s => s.seasonNumber === latest.seasonNumber);
  const current = seasons[index];
  if (current !== undefined && latest.episodeNumber < current.episodeCount) {
    return {
      seasonNumber: latest.seasonNumber,
      episodeNumber: latest.episodeNumber + 1,
    };
  }

  const following = seasons[index + 1];
  return following !== undefined
    ? { seasonNumber: following.seasonNumber, episodeNumber: 1 }
    : null;
}

/** Returns a date as "YYYY-MM-DD" in the phone's local time, e.g. "2026-11-03". */
export function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Turns "2026-11-03" into "3 Nov". Returns null when the text isn't a date. */
export function shortDate(iso: string): string | null {
  const [, month, day] = iso.split("-");
  const monthName = MONTHS[Number(month) - 1];
  if (monthName === undefined || day === undefined) {
    return null;
  }
  return `${Number(day)} ${monthName}`;
}

/** True when the episode aired before today. No date counts as not aired. */
export function isAired(airDate: string | null, today: string): boolean {
  return airDate !== null && airDate < today;
}

/**
 * Returns the text for the next episode that hasn't aired yet, e.g.
 * "Next: S3 E5 · 7 Nov". Null when there is none or it has already aired.
 */
export function formatNextEpisode(
  next: NextEpisode | null,
  today: string,
): string | null {
  if (next === null || isAired(next.airDate, today)) {
    return null;
  }
  const date = shortDate(next.airDate);
  if (date === null) {
    return null;
  }
  return `Next: S${next.seasonNumber} E${next.episodeNumber} · ${date}`;
}

/**
 * Returns only the episodes that aired before today, as season + episode.
 * Used by "Mark as Done", so episodes that haven't aired stay unwatched.
 */
export function airedEpisodes(
  episodes: readonly Episode[],
  today: string,
): LatestEpisodeType[] {
  return episodes
    .filter(episode => isAired(episode.airDate, today))
    .map(episode => ({
      seasonNumber: episode.seasonNumber,
      episodeNumber: episode.episodeNumber,
    }));
}
