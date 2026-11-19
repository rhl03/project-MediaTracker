module.exports = {
  preset: "@react-native/jest-preset",
  // Loads the web versions of Reanimated and Worklets instead of the native ones.
  resolver: "react-native-reanimated/jest/resolver",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-vector-icons|@shopify/flash-list|react-native-pager-view|react-native-gesture-handler|react-native-reanimated|react-native-worklets|react-native-reorderable-list)/)",
  ],
  setupFilesAfterEnv: ["@shopify/flash-list/jestSetup", "./jest.setup.js"],
};
