import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontSize, fontWeight } from "../../../theme/typography";

type Props = {
  title: string;
  min: number;
  max: number;
  // The saved value; the thumb only jumps here after release.
  value: number;
  // The number shown next to the title, also while dragging.
  shownValue: number;
  onSlide: (value: number) => void;
  onRelease: (value: number) => void;
};

// A setting with its current number on the right and a whole-number slider below.
export function SliderRow({
  title,
  min,
  max,
  value,
  shownValue,
  onSlide,
  onRelease,
}: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{shownValue}</Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onSlide}
        onSlidingComplete={onRelease}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.surface3}
        thumbTintColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  texts: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  value: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
});
