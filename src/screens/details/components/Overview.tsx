import * as React from "react";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontSize, lineHeight } from "../../../theme/typography";

type Props = {
  text: string;
};

// Lines shown before the overview is opened.
const COLLAPSED_LINES = 3;

// The title's description: the first lines, the whole text after a tap.
export function Overview({ text }: Props): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable onPress={() => setExpanded(open => !open)}>
      <Text
        style={styles.text}
        numberOfLines={expanded ? undefined : COLLAPSED_LINES}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    marginTop: spacing.lg,
  },
});
