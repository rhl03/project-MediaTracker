import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import type { Episode } from "../../../domain/types";
import { shortDate } from "../../../domain/progress";

import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { opacity } from "../../../theme/height";
import { fontSize, fontWeight } from "../../../theme/typography";
import { RippleButton } from "../../../components/RippleButton";

type Props = {
  episode: Episode;
  watched: boolean;
  aired: boolean;
  disabled: boolean;
  onToggle: (episode: Episode, watched: boolean) => void;
};

// Size of the square with the episode number.
const NUMBER_BOX = 36;

// The date line: the air date, "Airs 12 Dec" or "Not announced yet".
function dateText(episode: Episode, aired: boolean): string {
  if (episode.airDate === null) {
    return "Not announced yet";
  }
  if (aired) {
    return episode.airDate;
  }
  return `Airs ${shortDate(episode.airDate) ?? episode.airDate}`;
}

// One episode: number, name, date and a tick; tapping toggles it once aired.
function EpisodeRowView({
  episode,
  watched,
  aired,
  disabled,
  onToggle,
}: Props): React.JSX.Element {
  return (
    <RippleButton
      onPress={() => onToggle(episode, watched)}
      disabled={disabled || !aired}
      style={[styles.card, !aired && styles.upcoming]}
      contentStyle={styles.content}
    >
      <View style={[styles.numberBox, watched && styles.numberBoxWatched]}>
        <Text style={[styles.number, watched && styles.numberWatched]}>
          {episode.episodeNumber}
        </Text>
      </View>

      <View style={styles.texts}>
        <Text
          style={[styles.name, watched && styles.nameWatched]}
          numberOfLines={1}
        >
          {episode.name}
        </Text>
        <Text style={[styles.date, !aired && styles.dateUpcoming]}>
          {dateText(episode, aired)}
        </Text>
      </View>

      {aired ? (
        <View style={disabled && styles.disabled}>
          <MaterialIcons
            name={watched ? "check-circle" : "radio-button-unchecked"}
            size={28}
            color={watched ? colors.primary : colors.textMuted}
          />
        </View>
      ) : (
        <MaterialIcons name="schedule" size={24} color={colors.textMuted} />
      )}
    </RippleButton>
  );
}

// Only redraws a row when its own props change.
export const EpisodeRow = React.memo(EpisodeRowView);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  upcoming: {
    opacity: opacity.disabled,
  },
  numberBox: {
    width: NUMBER_BOX,
    height: NUMBER_BOX,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  numberBoxWatched: {
    backgroundColor: colors.primaryContainer,
  },
  number: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  numberWatched: {
    color: colors.primary,
  },
  texts: {
    flex: 1,
    marginRight: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  nameWatched: {
    color: colors.textMuted,
  },
  date: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
  dateUpcoming: {
    color: colors.primary,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});
