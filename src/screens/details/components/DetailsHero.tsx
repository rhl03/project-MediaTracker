import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { LoadedDetails } from "../../../domain/types";
import { posterUrl } from "../../../tmdb/images";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { fontSize, fontWeight } from "../../../theme/typography";

type Props = {
  loaded: LoadedDetails;
};

// Width of the poster in the hero; the height follows from 2:3.
const POSTER_WIDTH = 110;

// How strong the background poster is blurred.
const BLUR_RADIUS = 12;

// "Series · 5 seasons · 62 episodes" or "Movie · 1999".
function metaLine(loaded: LoadedDetails): string {
  if (loaded.mediaType === "tv") {
    const seasons = loaded.details.seasons.length;
    const episodes = loaded.details.totalEpisodes;
    const seasonWord = seasons === 1 ? "season" : "seasons";
    return `Series · ${seasons} ${seasonWord} · ${episodes} episodes`;
  }
  const year = loaded.details.releaseDate?.slice(0, 4);
  return year !== undefined ? `Movie · ${year}` : "Movie";
}

// The top of Details: blurred poster behind, poster, name and a short info line.
export function DetailsHero({ loaded }: Props): React.JSX.Element {
  const uri = posterUrl(loaded.details.posterPath, "w342");
  const blurUri = posterUrl(loaded.details.posterPath, "w185");

  return (
    <View style={styles.hero}>
      {blurUri !== null && (
        <Image
          source={{ uri: blurUri }}
          style={StyleSheet.absoluteFill}
          blurRadius={BLUR_RADIUS}
        />
      )}
      <View style={styles.shade} />

      <View style={styles.row}>
        {uri !== null ? (
          <Image source={{ uri }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.placeholder]} />
        )}
        <View style={styles.texts}>
          <Text style={styles.name} numberOfLines={3}>
            {loaded.details.name}
          </Text>
          <Text style={styles.meta}>{metaLine(loaded)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: "hidden",
  },
  // The app background at 70 %, so the blurred poster shows through.
  shade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(18, 19, 24, 0.7)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  poster: {
    width: POSTER_WIDTH,
    aspectRatio: 2 / 3,
    borderRadius: radius.sm,
  },
  placeholder: {
    backgroundColor: colors.surface3,
  },
  texts: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xsm,
  },
});
