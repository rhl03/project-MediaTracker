import type { NavigatorScreenParams } from "@react-navigation/native";
import type { MediaType } from "../domain/types";

/** Tabs in the bottom bar. */
export type TabParamList = {
  Library: undefined;
  Settings: undefined;
};

/** Screens in the root stack. Tabs is the first one; the rest open over it without the bottom bar. */
export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Search: undefined;
  Details: { mediaType: MediaType; tmdbId: number };
  About: undefined;
  Manage: undefined;
};
