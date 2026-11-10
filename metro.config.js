const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

/** @type {import("@react-native/metro-config").MetroConfig} */
const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, "sql"],
  },
};

module.exports = mergeConfig(defaultConfig, config);
