import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import type { Badge } from "../domain/types";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { fontSize, fontWeight } from "../theme/typography";

/** Size of the square corner area that clips the ribbon. */
const CORNER = 44;

/** Diagonal ribbon in the poster's top-right corner: the percent, a check, or nothing. */
export function ProgressBadge(props: {
  badge: Badge;
}): React.JSX.Element | null {
  const { badge } = props;

  if (badge.kind === "none") {
    return null;
  }

  return (
    <View style={styles.corner}>
      <View style={styles.ribbon}>
        {badge.kind === "check" ? (
          <MaterialIcons
            name="check"
            size={12}
            color={colors.primary}
            style={styles.icon}
          />
        ) : (
          <Text style={styles.text}>{badge.value}%</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /** Clips the ribbon to the poster's rounded top-right corner. */
  corner: {
    width: CORNER,
    height: CORNER,
    overflow: "hidden",
    borderTopRightRadius: radius.sm,
  },
  /** The band: centred on the corner's diagonal, then turned 45°. */
  ribbon: {
    position: "absolute",
    left: 0,
    top: 4,
    width: 62,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryContainer,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.primary,
    transform: [{ rotate: "45deg" }],
  },
  /** Turns the check back upright; the percent text runs along the band. */
  icon: {
    transform: [{ rotate: "-45deg" }],
  },
  text: {
    color: colors.primary,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.bold,
  },
});
