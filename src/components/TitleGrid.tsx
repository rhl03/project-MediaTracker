import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import type { TrackedTitle } from "../domain/types";
import { PosterCard } from "./PosterCard";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

/** Posters per row when the caller doesn't choose. */
const DEFAULT_COLUMNS = 4;

/** Poster grid. Only displays: the titles come from the screen (via a hook). */
export function TitleGrid(props: {
  titles: TrackedTitle[];
  loading: boolean;
  selectedIds: ReadonlySet<number>;
  onPress: (title: TrackedTitle) => void;
  onLongPress: (title: TrackedTitle) => void;
  columns?: number;
}): React.JSX.Element {
  const {
    titles,
    loading,
    selectedIds,
    onPress,
    onLongPress,
    columns = DEFAULT_COLUMNS,
  } = props;

  return (
    <FlashList
      key={columns}
      contentContainerStyle={styles.listContent}
      data={titles}
      extraData={selectedIds}
      numColumns={columns}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          <PosterCard
            title={item}
            selected={selectedIds.has(item.id)}
            onPress={() => onPress(item)}
            onLongPress={() => onLongPress(item)}
          />
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.infoText}>
          {loading
            ? "Loading…"
            : "Nothing here yet. Tap the search bar to add something."}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  cell: {
    paddingHorizontal: 1,
    marginBottom: spacing.sm,
  },
  infoText: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginHorizontal: spacing.xsm,
  },
});
