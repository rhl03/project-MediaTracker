import { useEffect, useState } from "react";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import migrations from "./drizzle/migrations";
import { db } from "./src/db/database";
import { ensureDefaultCategory } from "./src/db/categories";
import { useAppFocus } from "./src/hooks/useAppFocus";
import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
import { TestScreen } from "./src/screens/TestScreen";

const queryClient = new QueryClient();

function App() {
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
      <View>
        <Text>Database error: {(error ?? seedError)?.message}</Text>
      </View>
    );
  }

  if (!success || !seeded) {
    return (
      <View>
        <Text>Preparing database...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <TestScreen />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
