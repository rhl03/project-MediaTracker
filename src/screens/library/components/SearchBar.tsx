import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { height } from "../../../theme/height";
import { fontSize } from "../../../theme/typography";

type Props = {
  onPress: () => void;
  onMenuPress: () => void;
};

// The search bar at the top of the Library tab; opens the Search screen.
export function SearchBar({ onPress, onMenuPress }: Props): React.JSX.Element {
  return (
    <Pressable style={styles.bar} onPress={onPress}>
      <MaterialIcons name="search" size={24} color={colors.textMuted} />
      <Text style={styles.text}>Search movies, series, anime</Text>
      <Pressable onPress={onMenuPress} hitSlop={12}>
        <MaterialIcons name="more-vert" size={24} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: height.bar,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
  },
  text: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSize.xl,
    marginLeft: spacing.md,
  },
});
