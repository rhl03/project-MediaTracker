/**
 * @format
 */

import React from "react";
import ReactTestRenderer from "react-test-renderer";
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";
import App from "../App";

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);

test("renders correctly", async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
