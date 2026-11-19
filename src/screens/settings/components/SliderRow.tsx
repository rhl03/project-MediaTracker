import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontSize, fontWeight } from "../../../theme/typography";
import { ICON_GAP, ICON_SIZE } from "./SettingsRow";

type Props = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
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

// A settings row with icon, title and number, and a whole-number slider under the title.
export function SliderRow({
  icon,
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
      <View style={styles.top}>
        <MaterialIcons name={icon} size={ICON_SIZE} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{shownValue}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onSlide}
        onSlidingComplete={onRelease}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.textMuted}
        thumbTintColor={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: ICON_GAP,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.lg,
  },
  value: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  // Starts under the title, not under the icon.
  slider: {
    marginLeft: ICON_SIZE + ICON_GAP,
    marginTop: spacing.sm,
  },
});
