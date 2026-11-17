import * as React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import type { Episode, LatestEpisodeType } from "../../../domain/types";
import { isAired, isoDate } from "../../../domain/progress";
import { useSeason } from "../../../hooks/tmdbQueries";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { EpisodeRow } from "./EpisodeRow";

type Props = {
  tmdbId: number;
  seasonNumber: number;
  watched: ReadonlyArray<LatestEpisodeType>;
  disabled: boolean;
  onToggle: (episode: Episode, watched: boolean) => void;
};

// The episode rows of one season, loaded from TMDB.
export function SeasonEpisodes({
  tmdbId,
  seasonNumber,
  watched,
  disabled,
  onToggle,
}: Props): React.JSX.Element {
  const { data, isPending, error } = useSeason(tmdbId, seasonNumber);
  const today = isoDate(new Date());
  const watchedKeys = new Set(
    watched.map(ref => `${ref.seasonNumber}-${ref.episodeNumber}`),
  );

  if (isPending) {
    return <ActivityIndicator style={styles.loading} color={colors.primary} />;
  }
  if (error !== null) {
    return <Text style={styles.errorText}>{error.message}</Text>;
  }

  return (
    <View style={styles.list}>
      {data.map(episode => (
        <EpisodeRow
          key={episode.episodeNumber}
          episode={episode}
          watched={watchedKeys.has(
            `${episode.seasonNumber}-${episode.episodeNumber}`,
          )}
          aired={isAired(episode.airDate, today)}
          disabled={disabled}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.lg,
  },
  loading: {
    marginTop: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.lg,
  },
});
