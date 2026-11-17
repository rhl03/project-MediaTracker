import * as React from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import PagerView from "react-native-pager-view";
import type { RootStackParamList, TabParamList } from "../../navigation/types";
import type { TrackedTitle } from "../../domain/types";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { CategoryTabs } from "../../components/CategoryTabs";
import {
  useCategories,
  useRemoveTitles,
  useResetProgress,
} from "../../hooks/libraryQueries";
import { spacing } from "../../theme/spacing";
import { SearchBar } from "./components/SearchBar";
import { SelectionBar } from "./components/SelectionBar";
import { CategoryPage } from "./components/CategoryPage";
import { useSelection } from "./useSelection";
import { useCategoryPager } from "./useCategoryPager";

// The Library tab, which can also open screens of the root stack.
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Library">,
  NativeStackScreenProps<RootStackParamList>
>;

// What the confirm dialog is asking about.
type PendingAction = "remove" | "reset";

// Library tab: search bar, selection bar and one poster grid per category.
export function LibraryScreen({ navigation }: Props): React.JSX.Element {
  const { data: categories = [] } = useCategories();
  const { selectedIds, selecting, clearSelection, toggleSelected } =
    useSelection();
  const { pagerRef, progress, selectTab, onPageScroll } = useCategoryPager(
    selecting,
    clearSelection,
  );
  const removeTitles = useRemoveTitles();
  const resetTitles = useResetProgress();
  const [confirming, setConfirming] = useState<PendingAction | null>(null);

  function onPosterPress(title: TrackedTitle) {
    if (selecting) {
      toggleSelected(title);
      return;
    }
    navigation.navigate("Details", {
      mediaType: title.mediaType,
      tmdbId: title.tmdbId,
    });
  }

  function runConfirmed() {
    const ids = [...selectedIds];
    if (confirming === "remove") {
      removeTitles.mutate(ids);
    } else {
      resetTitles.mutate(ids);
    }
    setConfirming(null);
    clearSelection();
  }

  const count = selectedIds.size;
  const titleCount = count === 1 ? "1 title" : `${count} titles`;

  const dialog =
    confirming === "reset"
      ? {
          icon: "restart-alt" as const,
          title: `Reset progress of ${titleCount}?`,
          message: "Watched episodes and movies will be unmarked.",
          confirmLabel: "Reset",
          tone: "primary" as const,
        }
      : {
          icon: "delete-outline" as const,
          title: `Remove ${titleCount}?`,
          message: "Progress will be deleted too. This can't be undone.",
          confirmLabel: "Remove",
          tone: "danger" as const,
        };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        {selecting ? (
          <SelectionBar
            count={count}
            onClose={clearSelection}
            onReset={() => setConfirming("reset")}
            onRemove={() => setConfirming("remove")}
          />
        ) : (
          <SearchBar
            onPress={() => navigation.navigate("Search")}
            onMenuPress={() => navigation.navigate("Manage")}
          />
        )}
      </View>

      <CategoryTabs
        categories={categories}
        progress={progress}
        onSelect={selectTab}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        scrollEnabled={!selecting}
        onPageScroll={onPageScroll}
      >
        {categories.map(category => (
          <View key={category.id}>
            <CategoryPage
              categoryId={category.id}
              selectedIds={selectedIds}
              onPress={onPosterPress}
              onLongPress={toggleSelected}
            />
          </View>
        ))}
      </PagerView>

      <ConfirmDialog
        visible={confirming !== null}
        icon={dialog.icon}
        title={dialog.title}
        message={dialog.message}
        confirmLabel={dialog.confirmLabel}
        tone={dialog.tone}
        onConfirm={runConfirmed}
        onCancel={() => setConfirming(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  pager: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
  },
});
