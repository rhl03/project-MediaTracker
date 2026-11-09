import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAppFocus } from "./src/hooks/useAppFocus";
import { useOnlineStatus } from "./src/hooks/useOnlineStatus";
import { TestScreen } from "./src/screens/TestScreen";

const queryClient = new QueryClient();

function App() {
  useAppFocus();
  useOnlineStatus();

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
