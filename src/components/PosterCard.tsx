import * as React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { TrackedTitle } from "../domain/types";
import { progressBadge } from "../domain/progress";
import { posterUrl } from "../tmdb/images";
import { ProgressBadge } from "./ProgressBadge";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { opacity } from "../theme/sizes";
import { fontSize } from "../theme/typography";

/** One poster in the grid: image (or a placeholder), progress badge and name. */
export function PosterCard(props: {
  title: TrackedTitle;
  selected: boolean;
  onPress: () => void;
  onLongPress: () => void;
}): React.JSX.Element {
  const { title, selected, onPress, onLongPress } = props;
  const uri = posterUrl(title.posterPath, "w342");

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={[styles.imageWrapper, selected && styles.dimmed]}>
        {uri !== null ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={styles.placeholderText} numberOfLines={3}>
              {title.name}
            </Text>
          </View>
        )}
        <View style={styles.badge}>
          <ProgressBadge badge={progressBadge(title)} />
        </View>
      </View>
      <Text
        style={[styles.name, selected && styles.nameSelected]}
        numberOfLines={2}
      >
        {title.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer,
  },
  imageWrapper: {
    position: "relative",
  },
  dimmed: {
    opacity: opacity.dimmed,
  },
  image: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: radius.sm,
  },
  placeholder: {
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xsm,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.sm,
    marginTop: spacing.xsm,
  },
  nameSelected: {
    color: colors.textMuted,
  },
});
