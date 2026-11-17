import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

type Props = {
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  // The outer shape: size, corners, background, border, margins.
  style?: StyleProp<ViewStyle>;
  // The inside: alignment and padding of the content.
  contentStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

// A button whose ripple is clipped to its own shape by the outer View.
export function RippleButton({
  onPress,
  onLongPress,
  disabled = false,
  style,
  contentStyle,
  children,
}: Props): React.JSX.Element {
  return (
    <View style={[styles.clip, style]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
        android_ripple={disabled ? undefined : { color: colors.ripple }}
        style={[styles.fill, contentStyle]}
      >
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: "hidden",
  },
  // flexGrow fills a fixed height but keeps its own height otherwise.
  fill: {
    flexGrow: 1,
  },
});
