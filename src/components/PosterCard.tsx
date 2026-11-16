import * as React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Badge } from "../domain/types";
import { posterUrl } from "../tmdb/images";
import { ProgressBadge } from "./ProgressBadge";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { opacity } from "../theme/height";
import { fontSize } from "../theme/typography";

// One poster in a grid: image (or a placeholder), optional progress badge and
// name. Used by the Library (with badge and selection) and Search (without).
export function PosterCard(props: {
  name: string;
  posterPath: string | null;
  badge?: Badge;
  selected?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}): React.JSX.Element {
  const {
    name,
    posterPath,
    badge,
    selected = false,
    onPress,
    onLongPress,
  } = props;
  const uri = posterUrl(posterPath, "w342");

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
              {name}
            </Text>
          </View>
        )}
        {badge !== undefined && (
          <View style={styles.badge}>
            <ProgressBadge badge={badge} />
          </View>
        )}
      </View>
      <Text
        style={[styles.name, selected && styles.nameSelected]}
        numberOfLines={2}
      >
        {name}
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
