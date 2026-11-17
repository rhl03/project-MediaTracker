import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontWeight } from "../../../theme/typography";

type Props = {
  label: string;
  percent: number;
};

// Height of the progress bar.
const BAR_HEIGHT = 4;

// "Up next · S2 E3" with the percent on the right and a thin bar below.
export function WatchProgress({ label, percent }: Props): React.JSX.Element {
  return (
    <View style={styles.progress}>
      <View style={styles.textRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    marginTop: spacing.lg,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xsm,
  },
  label: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  percent: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  track: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.surface2,
    overflow: "hidden",
  },
  fill: {
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    backgroundColor: colors.primary,
  },
});
