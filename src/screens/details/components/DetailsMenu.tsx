import * as React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RippleButton } from "../../../components/RippleButton";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { fontSize } from "../../../theme/typography";

export type MenuItem = {
  label: string;
  danger?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  items: ReadonlyArray<MenuItem>;
  onClose: () => void;
};

// Android's native header is 56 high; the menu opens right below it.
const HEADER_HEIGHT = 56;

// Width of the menu.
const MENU_WIDTH = 220;

// The ⋮ popup on Details; tapping an entry closes it and runs the entry.
export function DetailsMenu({
  visible,
  items,
  onClose,
}: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.menu, { top: insets.top + HEADER_HEIGHT }]}>
          {items.map(item => (
            <RippleButton
              key={item.label}
              onPress={() => {
                onClose();
                item.onPress();
              }}
              contentStyle={styles.item}
            >
              <Text style={[styles.text, item.danger && styles.danger]}>
                {item.label}
              </Text>
            </RippleButton>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    right: spacing.sm,
    width: MENU_WIDTH,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    elevation: 8,
  },
  item: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  text: {
    color: colors.text,
    fontSize: fontSize.md,
  },
  danger: {
    color: colors.danger,
  },
});
