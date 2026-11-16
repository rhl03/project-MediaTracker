import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { fontWeight } from "../../../theme/typography";

type Props = {
  text: string;
};

// Small pill with the next episode's air date, e.g. "Next: S6 E1 · 12 Dec".
export function NextEpisode({ text }: Props): React.JSX.Element {
  return (
    <View style={styles.pill}>
      <MaterialIcons name="event" size={18} color={colors.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  text: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
});
