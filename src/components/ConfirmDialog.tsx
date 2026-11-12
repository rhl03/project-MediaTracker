import * as React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { fontSize, fontWeight, lineHeight } from "../theme/typography";
import { colors } from "../theme/colors";
import { height, opacity } from "../theme/sizes";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";

export function ConfirmDialog(props: {
  visible: boolean;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}): React.JSX.Element {
  const { visible, icon, title, message, confirmLabel, onConfirm, onCancel } =
    props;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => { }}>
          <View style={styles.iconCircle}>
            <MaterialIcons name={icon} size={28} color="#f28b82" />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.cancel,
                pressed && styles.pressed,
              ]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.confirm,
                pressed && styles.pressed,
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.xxl,
    backgroundColor: colors.dangerContainer,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  message: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
    alignSelf: "stretch",
  },
  button: {
    flex: 1,
    height: height.button,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
  },
  cancel: {
    backgroundColor: colors.surface3,
  },
  confirm: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  cancelText: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  confirmText: {
    color: colors.background,
    fontWeight: fontWeight.bold,
  },
});
