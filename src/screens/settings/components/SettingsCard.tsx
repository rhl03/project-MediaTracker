import * as React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";

// A rounded card that groups the rows of one section.
export function SettingsCard({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  // overflow hidden keeps the row ripples inside the rounded corners.
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
  },
});
