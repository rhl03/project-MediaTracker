import {
  Badge,
  Episode,
  LatestEpisodeType,
  NextEpisode,
  SeasonSummary,
  TrackedTitle,
} from "./types";

/** Short month names for shortDate, January first. */
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

/** Watched percent (0–100), rounded and capped at 100. 0 when total is 0. */
export function progressPercent(watched: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.min(Math.round((watched / total) * 100), 100);
}

/** The furthest watched episode (later season wins), or null if none. */
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

/** A label like "S2 E5", or "Not started" when there is no episode. */
export function progressLabel(latest: LatestEpisodeType | null): string {
  if (latest === null) {
    return "Not started";
  }
  return `S${latest.seasonNumber} E${latest.episodeNumber}`;
}

/** The poster badge: check when done, percent otherwise, nothing at 0%. */
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

/** Every episode from S1 E1 up to and including the target. */
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

/** The episode to watch next, or null when the series is done. */
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

/** A date as "YYYY-MM-DD" in the phone's local time. */
export function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** "2026-11-03" → "3 Nov". Null when the text isn't a date. */
export function shortDate(iso: string): string | null {
  const [, month, day] = iso.split("-");
  const monthName = MONTHS[Number(month) - 1];
  if (monthName === undefined || day === undefined) {
    return null;
  }
  return `${Number(day)} ${monthName}`;
}

/** True when the episode aired before today. No date = not aired. */
export function isAired(airDate: string | null, today: string): boolean {
  return airDate !== null && airDate < today;
}

/** Text like "Next: S3 E5 · 7 Nov", or null when already aired or none. */
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

/** Only the episodes that aired before today. Used by "Mark as Done". */
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
