module.exports = {
  preset: "@react-native/jest-preset",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@react-native-vector-icons|@shopify/flash-list|react-native-pager-view)/)",
  ],
  setupFilesAfterEnv: ["@shopify/flash-list/jestSetup"],
};
