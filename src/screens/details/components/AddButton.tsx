import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { height, opacity } from "../../../theme/height";
import { fontWeight } from "../../../theme/typography";

type Props = {
  // Names of the categories the title is in; empty when it isn't saved.
  categoryNames: ReadonlyArray<string>;
  onPress: () => void;
};

// The full-width button on Details. "Add" while the title is in no category,
// otherwise "In Library, …" in a dark style. Both open the category picker.
export function AddButton({
  categoryNames,
  onPress,
}: Props): React.JSX.Element {
  const added = categoryNames.length > 0;
  const label = added ? `In ${categoryNames.join(", ")}` : "Add";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        added ? styles.added : styles.notAdded,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[styles.text, added ? styles.addedText : styles.notAddedText]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: height.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 2,
    marginTop: spacing.xl,
  },
  notAdded: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  added: {
    backgroundColor: colors.surface2,
    borderColor: colors.primary,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  text: {
    fontWeight: fontWeight.bold,
  },
  notAddedText: {
    color: colors.background,
  },
  addedText: {
    color: colors.primary,
  },
});
