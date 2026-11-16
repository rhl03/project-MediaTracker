import * as React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import migrations from "./drizzle/migrations";
import { db } from "./src/db/database";
import { ensureDefaultCategory } from "./src/db/queries/categories";
import { useAppFocus } from "./src/hooks/useAppFocus";
import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { colors } from "./src/theme/colors";
import { spacing } from "./src/theme/spacing";
import { fontSize, lineHeight } from "./src/theme/typography";

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  useAppFocus();
  useOnlineStatus();

  const { success, error } = useMigrations(db, migrations);
  const [seeded, setSeeded] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);

  useEffect(() => {
    if (!success) {
      return;
    }
    ensureDefaultCategory(db)
      .then(() => setSeeded(true))
      .catch(setSeedError);
  }, [success]);

  if (error || seedError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          Database error: {(error ?? seedError)?.message}
        </Text>
      </View>
    );
  }

  if (!success || !seeded) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Preparing database...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

// The full-screen views shown before the app is ready.
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  message: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    textAlign: "center",
  },
});

export default App;
