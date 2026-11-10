import { StatusBar, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMigrations } from "drizzle-orm/op-sqlite/migrator";
import migrations from "./drizzle/migrations";
import { db } from "./src/db/database";
import { useAppFocus } from "./src/hooks/useAppFocus";
import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
import { TestScreen } from "./src/screens/TestScreen";

const queryClient = new QueryClient();

function App() {
  useAppFocus();
  useOnlineStatus();

  const { success, error } = useMigrations(db, migrations);
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
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
