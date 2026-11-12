import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SearchResult, TrackedTitle } from "../../domain/types";
import { useSearchTitles } from "../../hooks/tmdbQueries";
import { PosterCard } from "../../components/PosterCard";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

/** TEMPORARY: search term for the demo posters, and posters per row. */
const DEMO_QUERY = "star";
const COLUMNS = 4;

/** TEMPORARY: turns a real search result into a tracked title with made-up progress. */
function toDemoTitle(result: SearchResult, index: number): TrackedTitle {
  const isMovie = result.mediaType === "movie";
  const totalEpisodes = isMovie ? 0 : 8 + (index % 4) * 6;
  const watchedCount = isMovie ? 0 : (index * 7) % (totalEpisodes + 1);

  return {
    id: index + 1,
    tmdbId: result.tmdbId,
    watched: isMovie && index % 2 === 0,
    mediaType: result.mediaType,
    name: result.name,
    posterPath: result.posterPath,
    totalEpisodes,
    watchedCount,
    addedAt: 0,
    lastWatchedAt: null,
  };
}

/** TEMPORARY: a grid of real TMDB posters to test PosterCard and ProgressBadge. */
export function PosterPreview(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const search = useSearchTitles(DEMO_QUERY);
  const cellWidth =
    (width - spacing.lg * 2 - spacing.sm * (COLUMNS - 1)) / COLUMNS;

  if (search.isPending) {
    return (
      <Text style={[styles.message, { marginTop: insets.top }]}>
        Loading posters...
      </Text>
    );
  }

  if (search.isError) {
    return (
      <Text style={[styles.message, { marginTop: insets.top }]}>
        Could not load posters: {search.error.message}
      </Text>
    );
  }

  const titles = search.data.map(toDemoTitle);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.grid,
        { paddingTop: insets.top + spacing.lg },
      ]}
    >
      {titles.map(title => (
        <View
          key={`${title.mediaType}-${title.tmdbId}`}
          style={{ width: cellWidth }}
        >
          <PosterCard
            title={title}
            selected={title.id === 3}
            onPress={() => { }}
            onLongPress={() => { }}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  message: {
    color: colors.text,
    padding: spacing.lg,
  },
});
