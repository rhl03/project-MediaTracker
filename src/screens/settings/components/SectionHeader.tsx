import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontSize, fontWeight } from "../../../theme/typography";

// Small blue title above a group of settings, like Kotatsu's sections.
export function SectionHeader({ title }: { title: string }): React.JSX.Element {
  return <Text style={styles.header}>{title}</Text>;
}

const styles = StyleSheet.create({
  header: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
});
