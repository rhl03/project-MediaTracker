import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, TabParamList } from "../../navigation/types";
import {
  MAX_POSTERS_PER_ROW,
  MIN_POSTERS_PER_ROW,
} from "../../domain/postersPerRow";
import { ManageCategoriesPopup } from "../../components/ManageCategoriesPopup";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { fontSize, fontWeight } from "../../theme/typography";
import { SectionHeader } from "./components/SectionHeader";
import { SettingsRow } from "./components/SettingsRow";
import { SliderRow } from "./components/SliderRow";
import { useSettings } from "./useSettings";

// Tab props plus the root stack, so this tab can open About.
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Settings">,
  NativeStackScreenProps<RootStackParamList>
>;

// Settings tab: every setting on one page in sections; only About opens a new page.
export function SettingsScreen({ navigation }: Props): React.JSX.Element {
  const {
    categoriesOpen,
    setCategoriesOpen,
    savedPostersPerRow,
    shownPostersPerRow,
    slidePostersPerRow,
    releasePostersPerRow,
  } = useSettings();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>

        <SectionHeader title="Library" />
        <SliderRow
          title="Posters per row"
          min={MIN_POSTERS_PER_ROW}
          max={MAX_POSTERS_PER_ROW}
          value={savedPostersPerRow}
          shownValue={shownPostersPerRow}
          onSlide={slidePostersPerRow}
          onRelease={releasePostersPerRow}
        />
        <SettingsRow
          icon="category"
          label="Categories"
          onPress={() => setCategoriesOpen(true)}
        />

        <SectionHeader title="App" />
        <SettingsRow
          icon="info-outline"
          label="About"
          onPress={() => navigation.navigate("About")}
        />
      </ScrollView>

      <ManageCategoriesPopup
        visible={categoriesOpen}
        onClose={() => setCategoriesOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
});
