import * as React from "react";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, TabParamList } from "../../navigation/types";
import type { TrackedTitle } from "../../domain/types";
import { TitleGrid } from "../../components/TitleGrid";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useLibraryTitles } from "../../hooks/useLibraryTitles";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { height } from "../../theme/sizes";
import { fontSize, fontWeight } from "../../theme/typography";

/** The Library tab, which can also open screens of the root stack. */
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Library">,
  NativeStackScreenProps<RootStackParamList>
>;

/** What the confirm dialog is asking about. */
type PendingAction = "remove" | "reset";

/** Library tab: search bar, selection bar and the poster grid. */
export function LibraryScreen({ navigation }: Props): React.JSX.Element {
  const { titles, loading } = useLibraryTitles();
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(
    new Set(),
  );
  const [confirming, setConfirming] = useState<PendingAction | null>(null);

  const selecting = selectedIds.size > 0;

  // While selecting, the phone's back button ends the selection
  // instead of leaving the app.
  useEffect(() => {
    if (!selecting) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setSelectedIds(new Set());
        return true;
      },
    );
    return () => subscription.remove();
  }, [selecting]);

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function toggleSelected(title: TrackedTitle) {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(title.id)) {
        next.delete(title.id);
      } else {
        next.add(title.id);
      }
      return next;
    });
  }

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
    setConfirming(null);
    // TODO (sub-step 4): remove/reset in the database via a hook.
    clearSelection();
  }

  const count = selectedIds.size;
  const titleCount = count === 1 ? "1 title" : `${count} titles`;

  const dialog =
    confirming === "reset"
      ? {
        icon: "restart-alt" as const,
        title: `Reset progress of ${titleCount}?`,
        message: "All watched episodes will be unmarked.",
        confirmLabel: "Reset",
      }
      : {
        icon: "delete-outline" as const,
        title: `Remove ${titleCount}?`,
        message: "Your watched episodes will be deleted too. This can't be undone.",
        confirmLabel: "Remove",
      };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        {selecting ? (
          <View style={[styles.bar, styles.selectionBar]}>
            <Pressable onPress={clearSelection} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.selectionText}>{count} selected</Text>
            <Pressable
              onPress={() => setConfirming("reset")}
              hitSlop={12}
              style={styles.barIcon}
            >
              <MaterialIcons name="restart-alt" size={24} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={() => setConfirming("remove")}
              hitSlop={12}
              style={styles.barIcon}
            >
              <MaterialIcons
                name="delete-outline"
                size={24}
                color={colors.danger}
              />
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.bar}
            onPress={() => navigation.navigate("Search")}
          >
            <MaterialIcons name="search" size={24} color={colors.textMuted} />
            <Text style={styles.searchText}>Search movies, series, anime</Text>
          </Pressable>
        )}
      </View>

      <TitleGrid
        titles={titles}
        loading={loading}
        selectedIds={selectedIds}
        onPress={onPosterPress}
        onLongPress={toggleSelected}
      />

      <ConfirmDialog
        visible={confirming !== null}
        icon={dialog.icon}
        title={dialog.title}
        message={dialog.message}
        confirmLabel={dialog.confirmLabel}
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
  header: {
    paddingHorizontal: spacing.lg,
  },
  bar: {
    height: height.bar,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
  },
  selectionBar: {
    backgroundColor: colors.primaryContainer,
  },
  searchText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSize.xl,
    marginLeft: spacing.md,
  },
  selectionText: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginLeft: spacing.md,
  },
  barIcon: {
    marginLeft: spacing.lg,
  },
});
