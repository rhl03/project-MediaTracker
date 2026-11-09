import { ScrollView, StyleSheet, Text } from "react-native";
import { describeTmdbError } from "../tmdb/client";
import {
  useMovieDetails,
  useSearchTitles,
  useSeason,
  useTvDetails,
} from "../hooks/tmdbQueries";

/** Temporary screen for step 4: checks that all four TMDB hooks load. Replaced in step 6. */
export function TestScreen() {
  const movie = useMovieDetails(603);
  const tv = useTvDetails(1396);
  const season = useSeason(1396, 1);
  const search = useSearchTitles("matrix");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Movie 603</Text>
      <Text style={styles.text}>
        {movie.isPending
          ? "Loading…"
          : movie.error
          ? describeTmdbError(movie.error)
          : `${movie.data.name} · ${movie.data.runtimeMinutes} min`}
      </Text>

      <Text style={styles.title}>Series 1396</Text>
      <Text style={styles.text}>
        {tv.isPending
          ? "Loading…"
          : tv.error
          ? describeTmdbError(tv.error)
          : `${tv.data.name} · ${tv.data.seasons.length} seasons · ${tv.data.totalEpisodes} episodes`}
      </Text>

      <Text style={styles.title}>Season 1 of 1396</Text>
      <Text style={styles.text}>
        {season.isPending
          ? "Loading…"
          : season.error
          ? describeTmdbError(season.error)
          : `${season.data.length} episodes · first: ${
              season.data[0]?.name ?? "-"
            }`}
      </Text>

      <Text style={styles.title}>Search "matrix"</Text>
      <Text style={styles.text}>
        {search.isPending
          ? "Loading…"
          : search.error
          ? describeTmdbError(search.error)
          : search.data
              .map(result => `${result.name} (${result.year ?? "?"})`)
              .join("\n")}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 48, backgroundColor: "#121318" },
  title: { color: "#a8c7fa", fontWeight: "bold", marginTop: 16 },
  text: { color: "#ffffff", marginTop: 4 },
});
