import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { useSearchTitles } from "../../hooks/tmdbQueries";
import { PosterCard } from "../../components/PosterCard";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { SearchField } from "./components/SearchField";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

type Props = NativeStackScreenProps<RootStackParamList, "Search">;

// Posters per row, the same as the Library grid.
const COLUMNS = 4;

// How long to wait after the last key press before searching.
const SEARCH_DELAY_MS = 400;

// Search screen: type a name, see matching movies and series from TMDB.
export function SearchScreen({ navigation }: Props): React.JSX.Element {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, SEARCH_DELAY_MS);
  const { data, isLoading, error } = useSearchTitles(debounced);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          onBack={() => navigation.goBack()}
        />
      </View>

      {isLoading && <Text style={styles.infoText}>Searching…</Text>}
      {error !== null && <Text style={styles.errorText}>{error.message}</Text>}

      <FlashList
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        data={data ?? []}
        numColumns={COLUMNS}
        keyExtractor={item => `${item.mediaType}-${item.tmdbId}`}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <PosterCard
              name={item.name}
              posterPath={item.posterPath}
              onPress={() =>
                navigation.navigate("Details", {
                  mediaType: item.mediaType,
                  tmdbId: item.tmdbId,
                })
              }
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
  infoText: {
    color: colors.textMuted,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  cell: {
    paddingHorizontal: 1,
    marginBottom: spacing.sm,
  },
});
