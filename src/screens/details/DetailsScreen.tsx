import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import type { Badge, MediaType } from "../../domain/types";
import {
  formatNextEpisode,
  isoDate,
  nextToWatch,
  progressBadge,
  progressLabel,
  progressPercent,
} from "../../domain/progress";
import { useDetails } from "../../hooks/tmdbQueries";
import {
  useCategories,
  useMarkMovieWatched,
  useRemoveTitles,
  useResetProgress,
  useSaveCategories,
  useSavedTitle,
  useTitleCategoryIds,
  useToggleEpisode,
  useUpdateTotalEpisodes,
  useWatchedEpisodes,
} from "../../hooks/libraryQueries";
import { CategoryTabs } from "../../components/CategoryTabs";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { IconButton } from "../../components/IconButton";
import { ManageCategoriesPopup } from "../../components/ManageCategoriesPopup";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { AddButton } from "./components/AddButton";
import { CategoryPicker } from "./components/CategoryPicker";
import { DetailsHero } from "./components/DetailsHero";
import { DetailsMenu, type MenuItem } from "./components/DetailsMenu";
import { NextEpisode } from "./components/NextEpisode";
import { Overview } from "./components/Overview";
import { SeasonEpisodes } from "./components/SeasonEpisodes";
import { WatchProgress } from "./components/WatchProgress";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

// What the confirm dialog is asking about.
type PendingAction = "reset" | "remove";

// How long the season underline slides after a tap.
const TAB_SLIDE_MS = 250;

// The title's page on the TMDB website.
function tmdbUrl(mediaType: MediaType, tmdbId: number): string {
  return `https://www.themoviedb.org/${mediaType}/${tmdbId}`;
}

// Details of one movie or series: hero, overview, Add, progress, next episode and episodes.
export function DetailsScreen({ navigation, route }: Props): React.JSX.Element {
  const { mediaType, tmdbId } = route.params;
  const { data, isPending, error } = useDetails(mediaType, tmdbId);
  const { data: categories = [] } = useCategories();
  const { data: checkedIds = [] } = useTitleCategoryIds(mediaType, tmdbId);
  const { data: savedTitle = null } = useSavedTitle(mediaType, tmdbId);
  const { data: watched = [] } = useWatchedEpisodes(savedTitle?.id);
  const saveCategories = useSaveCategories(data);
  const seasons = data?.mediaType === "tv" ? data.details.seasons : [];
  const toggleEpisode = useToggleEpisode(savedTitle?.id, seasons);
  const markWatched = useMarkMovieWatched(savedTitle?.id);
  const removeTitles = useRemoveTitles();
  const resetTitles = useResetProgress();
  const { mutate: updateTotal } = useUpdateTotalEpisodes();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState<PendingAction | null>(null);
  const [seasonIndex, setSeasonIndex] = useState(0);
  const seasonProgress = useRef(new Animated.Value(0)).current;

  // The episode total from TMDB, newer than the saved one.
  const totalEpisodes =
    data?.mediaType === "tv" ? data.details.totalEpisodes : 0;

  // The header icons: TMDB link always, ⋮ only for saved titles.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton
            name="open-in-new"
            color={colors.text}
            onPress={() => void Linking.openURL(tmdbUrl(mediaType, tmdbId))}
          />
          {savedTitle !== null && (
            <IconButton
              name="more-vert"
              color={colors.text}
              onPress={() => setMenuOpen(true)}
            />
          )}
        </View>
      ),
    });
  }, [navigation, savedTitle, mediaType, tmdbId]);

  // Saves TMDB's episode total when a saved series has new episodes.
  useEffect(() => {
    if (
      data?.mediaType === "tv" &&
      savedTitle !== null &&
      savedTitle.totalEpisodes !== totalEpisodes
    ) {
      updateTotal({ titleId: savedTitle.id, totalEpisodes });
    }
  }, [data, savedTitle, totalEpisodes, updateTotal]);

  // The names of the categories this title is in, in tab order.
  const categoryNames = categories
    .filter(category => checkedIds.includes(category.id))
    .map(category => category.name);

  // "Next: S6 E1 · 12 Dec" for series with a coming episode, else null.
  const nextLine =
    data?.mediaType === "tv"
      ? formatNextEpisode(data.details.nextEpisode, isoDate(new Date()))
      : null;

  // Progress is only shown for saved series.
  const showProgress = data?.mediaType === "tv" && savedTitle !== null;
  const upNext = nextToWatch(seasons, watched);
  const progressText =
    upNext !== null ? `Up next · ${progressLabel(upNext)}` : "All caught up";
  const percent = progressPercent(watched.length, totalEpisodes);

  // The poster badge, from the saved title with the current progress.
  const badge: Badge | null =
    savedTitle === null
      ? null
      : progressBadge({
          ...savedTitle,
          totalEpisodes,
          watchedCount: watched.length,
        });

  // The ⋮ menu: watched toggle for movies, reset for series, remove for both.
  const menuItems: MenuItem[] = [];
  if (savedTitle !== null && data?.mediaType === "movie") {
    menuItems.push({
      label: savedTitle.watched ? "Mark as unwatched" : "Mark as watched",
      onPress: () => markWatched.mutate(!savedTitle.watched),
    });
  }
  if (savedTitle !== null && data?.mediaType === "tv") {
    menuItems.push({
      label: "Reset progress",
      onPress: () => setConfirming("reset"),
    });
  }
  if (savedTitle !== null) {
    menuItems.push({
      label: "Remove",
      danger: true,
      onPress: () => setConfirming("remove"),
    });
  }

  // The seasons in the shape CategoryTabs expects.
  const seasonTabs = seasons.map(season => ({
    id: season.seasonNumber,
    name: season.name,
  }));
  const selectedSeason = seasons[seasonIndex];

  const name = data?.details.name ?? "";
  const removeMessage =
    data?.mediaType === "movie"
      ? "Its watched status will be deleted too. This can't be undone."
      : "Your watched episodes will be deleted too. This can't be undone.";
  const dialog =
    confirming === "reset"
      ? {
          icon: "restart-alt" as const,
          title: `Reset progress of ${name}?`,
          message: "All watched episodes will be unmarked.",
          confirmLabel: "Reset",
          tone: "primary" as const,
        }
      : {
          icon: "delete-outline" as const,
          title: `Remove ${name}?`,
          message: removeMessage,
          confirmLabel: "Remove",
          tone: "danger" as const,
        };

  function selectSeason(index: number) {
    setSeasonIndex(index);
    Animated.timing(seasonProgress, {
      toValue: index,
      duration: TAB_SLIDE_MS,
      useNativeDriver: false,
    }).start();
  }

  function save(selectedIds: number[]) {
    saveCategories.mutate({ previousIds: checkedIds, selectedIds });
    setPickerOpen(false);
  }

  // Swaps the picker for the categories popup.
  function openManage() {
    setPickerOpen(false);
    setManageOpen(true);
  }

  // Back to the picker, so the new categories can be ticked right away.
  function closeManage() {
    setManageOpen(false);
    setPickerOpen(true);
  }

  function runConfirmed() {
    if (savedTitle !== null) {
      if (confirming === "remove") {
        removeTitles.mutate([savedTitle.id]);
      } else {
        resetTitles.mutate([savedTitle.id]);
      }
    }
    setConfirming(null);
  }

  return (
    <View style={styles.container}>
      {isPending && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      {error !== null && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}

      {data !== undefined && (
        <ScrollView contentContainerStyle={styles.content}>
          <DetailsHero loaded={data} badge={badge} />

          <View style={styles.body}>
            {data.details.overview !== "" && (
              <Overview text={data.details.overview} />
            )}
            <AddButton
              categoryNames={categoryNames}
              onPress={() => setPickerOpen(true)}
            />
            {showProgress && (
              <WatchProgress label={progressText} percent={percent} />
            )}
            {nextLine !== null && <NextEpisode text={nextLine} />}
          </View>

          {seasonTabs.length > 0 && (
            <View style={styles.seasonTabs}>
              <CategoryTabs
                categories={seasonTabs}
                progress={seasonProgress}
                onSelect={selectSeason}
              />
            </View>
          )}

          {selectedSeason !== undefined && (
            <View style={styles.body}>
              <SeasonEpisodes
                tmdbId={tmdbId}
                seasonNumber={selectedSeason.seasonNumber}
                watched={watched}
                disabled={savedTitle === null}
                onToggle={(episode, isWatched) =>
                  toggleEpisode.mutate({ episode, watched: isWatched })
                }
              />
            </View>
          )}
        </ScrollView>
      )}

      <CategoryPicker
        visible={pickerOpen}
        categories={categories}
        checkedIds={checkedIds}
        onSave={save}
        onManage={openManage}
        onClose={() => setPickerOpen(false)}
      />

      <ManageCategoriesPopup visible={manageOpen} onClose={closeManage} />

      <DetailsMenu
        visible={menuOpen}
        items={menuItems}
        onClose={() => setMenuOpen(false)}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
  },
  content: {
    paddingBottom: spacing.xl,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  seasonTabs: {
    marginTop: spacing.lg,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
});
