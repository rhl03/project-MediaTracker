module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    "@babel/plugin-transform-export-namespace-from",
    ["inline-import", { extensions: [".sql"] }],
    // Must stay last: prepares Reanimated's worklets.
    "react-native-worklets/plugin",
  ],
};
