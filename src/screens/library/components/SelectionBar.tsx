import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "../../../components/IconButton";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { height } from "../../../theme/height";
import { fontSize, fontWeight } from "../../../theme/typography";

type Props = {
  count: number;
  onClose: () => void;
  onReset: () => void;
  onRemove: () => void;
};

// Replaces the search bar while posters are selected: ✕, count, reset, remove.
export function SelectionBar({
  count,
  onClose,
  onReset,
  onRemove,
}: Props): React.JSX.Element {
  return (
    <View style={styles.bar}>
      <IconButton name="close" color={colors.primary} onPress={onClose} />
      <Text style={styles.text}>{count} selected</Text>
      <IconButton
        name="restart-alt"
        color={colors.primary}
        onPress={onReset}
        style={styles.icon}
      />
      <IconButton
        name="delete-outline"
        color={colors.danger}
        onPress={onRemove}
        style={styles.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: height.bar,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
  },
  text: {
    flex: 1,
    color: colors.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginLeft: spacing.md,
  },
  icon: {
    marginLeft: spacing.lg,
  },
});
