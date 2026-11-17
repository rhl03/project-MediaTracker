import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";

type Props = {
  name: React.ComponentProps<typeof MaterialIcons>["name"];
  color: string;
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

// An icon you can tap, with a round ripple when pressed. The outer View is
// round and clips, so the Pressable's ripple inside it becomes a circle.
export function IconButton({
  name,
  color,
  onPress,
  size = 24,
  style,
}: Props): React.JSX.Element {
  return (
    <View style={[styles.clip, style]}>
      <Pressable
        onPress={onPress}
        hitSlop={spacing.xs}
        android_ripple={{ color: colors.ripple }}
        style={styles.button}
      >
        <MaterialIcons name={name} size={size} color={color} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Round and clipping; the negative margin keeps the icon in the same place
  // as without the padding.
  clip: {
    margin: -spacing.sm,
    borderRadius: radius.xxl,
    overflow: "hidden",
  },
  // Room around the icon for the ripple circle.
  button: {
    padding: spacing.sm,
  },
});
