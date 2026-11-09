import { getDefaultConfig, mergeConfig } from "@react-native/metro-config";

const defaultConfig = getDefaultConfig(__dirname);

/** @type {import("@react-native/metro-config").MetroConfig} */
const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, "sql"],
  },
};

export default mergeConfig(defaultConfig, config);
