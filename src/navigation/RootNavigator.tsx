import * as React from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, TabParamList } from "./types";
import { PlaceholderScreen } from "../screens/placeholderscreen/PlaceholderScreen";
import { colors } from "../theme/colors";
import { PosterPreview } from "../screens/placeholderscreen/PosterPreview";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/** Props React Navigation passes to a tab icon. */
type TabIconProps = { color: string; size: number };

/** Icon for the Library tab. */
function LibraryIcon({ color, size }: TabIconProps): React.JSX.Element {
  return <MaterialIcons name="video-library" color={color} size={size} />;
}

/** Icon for the Settings tab. */
function SettingsIcon({ color, size }: TabIconProps): React.JSX.Element {
  return <MaterialIcons name="settings" color={color} size={size} />;
}

/** Bottom bar with Library and Settings. */
function HomeTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelVisibilityMode: "unlabeled",
        tabBarStyle: { backgroundColor: colors.surface },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Library"
        component={PosterPreview}
        options={{ title: "Library", tabBarIcon: LibraryIcon }}
      />
      <Tab.Screen
        name="Settings"
        component={PlaceholderScreen}
        options={{ title: "Settings", tabBarIcon: SettingsIcon }}
      />
    </Tab.Navigator>
  );
}

/** Root stack: the tabs first, then the screens that open over them. */
export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={PlaceholderScreen}
        options={{ title: "Search" }}
      />
      <Stack.Screen
        name="Details"
        component={PlaceholderScreen}
        options={{ title: "Details" }}
      />
      <Stack.Screen
        name="About"
        component={PlaceholderScreen}
        options={{ title: "About" }}
      />
      <Stack.Screen
        name="Manage"
        component={PlaceholderScreen}
        options={{ title: "Manage categories" }}
      />
    </Stack.Navigator>
  );
}
