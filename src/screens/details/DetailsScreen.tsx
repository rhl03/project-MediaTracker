import * as React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { formatNextEpisode, isoDate } from "../../domain/progress";
import { useDetails } from "../../hooks/tmdbQueries";
import {
  useCategories,
  useSaveCategories,
  useTitleCategoryIds,
} from "../../hooks/libraryQueries";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { AddButton } from "./components/AddButton";
import { CategoryPicker } from "./components/CategoryPicker";
import { DetailsHero } from "./components/DetailsHero";
import { NextEpisode } from "./components/NextEpisode";
import { Overview } from "./components/Overview";

type Props = NativeStackScreenProps<RootStackParamList, "Details">;

// Details of one movie or series: hero, overview, Add and the next episode.
// The back arrow comes from the native stack header.
export function DetailsScreen({ navigation, route }: Props): React.JSX.Element {
  const { mediaType, tmdbId } = route.params;
  const { data, isPending, error } = useDetails(mediaType, tmdbId);
  const { data: categories = [] } = useCategories();
  const { data: checkedIds = [] } = useTitleCategoryIds(mediaType, tmdbId);
  const saveCategories = useSaveCategories(data);
  const [pickerOpen, setPickerOpen] = useState(false);

  // The names of the categories this title is in, in tab order.
  const categoryNames = categories
    .filter(category => checkedIds.includes(category.id))
    .map(category => category.name);

  // "Next: S6 E1 · 12 Dec" for series with a coming episode, else null.
  const nextLine =
    data?.mediaType === "tv"
      ? formatNextEpisode(data.details.nextEpisode, isoDate(new Date()))
      : null;

  function save(selectedIds: number[]) {
    saveCategories.mutate({ previousIds: checkedIds, selectedIds });
    setPickerOpen(false);
  }

  function openManage() {
    setPickerOpen(false);
    navigation.navigate("Manage");
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
          <DetailsHero loaded={data} />

          <View style={styles.body}>
            {data.details.overview !== "" && (
              <Overview text={data.details.overview} />
            )}
            <AddButton
              categoryNames={categoryNames}
              onPress={() => setPickerOpen(true)}
            />
            {nextLine !== null && <NextEpisode text={nextLine} />}
          </View>
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
});
