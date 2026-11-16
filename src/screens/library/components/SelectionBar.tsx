import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
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
      <Pressable onPress={onClose} hitSlop={12}>
        <MaterialIcons name="close" size={24} color={colors.primary} />
      </Pressable>
      <Text style={styles.text}>{count} selected</Text>
      <Pressable onPress={onReset} hitSlop={12} style={styles.icon}>
        <MaterialIcons name="restart-alt" size={24} color={colors.primary} />
      </Pressable>
      <Pressable onPress={onRemove} hitSlop={12} style={styles.icon}>
        <MaterialIcons name="delete-outline" size={24} color={colors.danger} />
      </Pressable>
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
