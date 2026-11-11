import type { NavigatorScreenParams } from "@react-navigation/native";

/** Tabs in the bottom bar. */
export type TabParamList = {
  Library: undefined;
  Settings: undefined;
};

/** Screens in the root stack. Tabs is the first one; the rest open over it without the bottom bar. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Search: undefined;
  Details: undefined;
  About: undefined;
  Manage: undefined;
};
