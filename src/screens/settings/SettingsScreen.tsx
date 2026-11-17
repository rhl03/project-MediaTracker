import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList, TabParamList } from "../../navigation/types";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { fontSize, fontWeight } from "../../theme/typography";
import { SettingsRow } from "./components/SettingsRow";

// Tab props plus the root stack, so this tab can open About and Manage.
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Settings">,
  NativeStackScreenProps<RootStackParamList>
>;

// Settings tab: links to Manage categories and About.
export function SettingsScreen({ navigation }: Props): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.title}>Settings</Text>
      <SettingsRow
        icon="category"
        label="Manage categories"
        onPress={() => navigation.navigate("Manage")}
      />
      <SettingsRow
        icon="info-outline"
        label="About"
        onPress={() => navigation.navigate("About")}
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
