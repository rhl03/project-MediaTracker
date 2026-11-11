import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import type { Badge } from "../domain/types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fontSize, fontWeight } from "../theme/typography";

/** Width of the bookmark; the notch's two triangles are half of it each. */
const TAG_WIDTH = 30;

/** Colours of the tag and of its text/check. Change these two to try other looks. */
const TAG_COLOR = colors.primary;
const CONTENT_COLOR = colors.background;

/** Bookmark tag hanging from the poster's top edge: the percent, a check, or nothing. */
export function ProgressBadge(props: {
  badge: Badge;
}): React.JSX.Element | null {
  const { badge } = props;

  if (badge.kind === "none") {
    return null;
  }

  return (
    <View>
      <View style={styles.body}>
        {badge.kind === "check" ? (
          <MaterialIcons name="check" size={14} color={CONTENT_COLOR} />
        ) : (
          <Text style={styles.text}>{badge.value}%</Text>
        )}
      </View>
      <View style={styles.notch} />
    </View>
  );
}

const styles = StyleSheet.create({
  /** The rectangle with the content. */
  body: {
    width: TAG_WIDTH,
    paddingTop: spacing.xsm,
    paddingBottom: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TAG_COLOR,
  },
  /** Two coloured triangles (left and right borders) with a transparent V between them. */
  notch: {
    width: 0,
    height: 0,
    borderLeftWidth: TAG_WIDTH / 2,
    borderRightWidth: TAG_WIDTH / 2,
    borderBottomWidth: 6,
    borderLeftColor: TAG_COLOR,
    borderRightColor: TAG_COLOR,
    borderBottomColor: "transparent",
  },
  text: {
    color: CONTENT_COLOR,
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.bold,
  },
});
