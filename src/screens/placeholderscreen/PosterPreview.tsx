import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SearchResult, TrackedTitle } from "../../domain/types";
import { useSearchTitles } from "../../hooks/tmdbQueries";
import { TitleGrid } from "../../components/TitleGrid";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";

/** TEMPORARY: search term for the demo posters, and posters per row to test. */
const DEMO_QUERY = "star";
const DEMO_COLUMNS = 4;

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

/** TEMPORARY: real TMDB posters in the TitleGrid, to test the grid and the badge. */
export function PosterPreview(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const search = useSearchTitles(DEMO_QUERY);

  if (search.isError) {
    return (
      <Text style={[styles.message, { marginTop: insets.top }]}>
        Could not load posters: {search.error.message}
      </Text>
    );
  }

  const titles = search.isPending ? [] : search.data.map(toDemoTitle);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <TitleGrid
        titles={titles}
        loading={search.isPending}
        selectedIds={new Set([3])}
        onPress={() => { }}
        onLongPress={() => { }}
        columns={DEMO_COLUMNS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  message: {
    color: colors.text,
    padding: spacing.lg,
  },
});
