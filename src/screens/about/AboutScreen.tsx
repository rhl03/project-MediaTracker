import * as React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { fontSize, fontWeight, lineHeight } from "../../theme/typography";
import { LinkRow } from "./components/LinkRow";

const REPO_URL = "https://github.com/rhl03/MediaTracker";
const KOTATSU_REDO_URL = "https://github.com/Kotatsu-Redo/Kotatsu-Redo";

// About: app info, source code link and credits (TMDB attribution, Kotatsu-Redo).
export function AboutScreen(): React.JSX.Element {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.appLogo}
        />
        <View style={styles.headerTexts}>
          <Text style={styles.appName}>Media Tracker</Text>
          <Text style={styles.text}>
            Track the movies, series and anime you watch.
          </Text>
        </View>
      </View>

      <Text style={styles.heading}>Source code</Text>
      <LinkRow
        icon="code"
        label={REPO_URL.replace("https://", "")}
        url={REPO_URL}
      />

      <Text style={styles.heading}>Credits</Text>
      <Image
        source={require("../../../assets/tmdb-logo.png")}
        style={styles.tmdbLogo}
        resizeMode="contain"
      />
      <Text style={styles.text}>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </Text>
      <Text style={styles.text}>
        UI design inspired by Kotatsu-Redo, a fork of Kotatsu.
      </Text>
      <LinkRow
        icon="palette"
        label="Kotatsu-Redo on GitHub"
        url={KOTATSU_REDO_URL}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  appLogo: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
  },
  headerTexts: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  appName: {
    color: colors.text,
    fontSize: fontSize.xxxxl,
    fontWeight: fontWeight.bold,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.xxl,
    marginBottom: spacing.xs,
  },
  text: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    marginTop: spacing.sm,
  },
  tmdbLogo: {
    height: 20,
    width: 150,
    marginTop: spacing.sm,
  },
});
