import * as React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { fontSize, fontWeight, lineHeight } from "../theme/typography";
import { colors } from "../theme/colors";
import { height, opacity } from "../theme/height";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import MaterialIcons from "@react-native-vector-icons/material-icons/static";

// Blue for actions that can be redone, red for ones that can't.
export type DialogTone = "primary" | "danger";

export function ConfirmDialog(props: {
  visible: boolean;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  title: string;
  message: string;
  confirmLabel: string;
  tone?: DialogTone;
  onConfirm: () => void;
  onCancel: () => void;
}): React.JSX.Element {
  const {
    visible,
    icon,
    title,
    message,
    confirmLabel,
    tone = "danger",
    onConfirm,
    onCancel,
  } = props;

  const danger = tone === "danger";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View
            style={[
              styles.iconCircle,
              danger ? styles.iconCircleDanger : styles.iconCirclePrimary,
            ]}
          >
            <MaterialIcons
              name={icon}
              size={28}
              color={danger ? colors.danger : colors.primary}
            />
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
                danger ? styles.confirmDanger : styles.confirmPrimary,
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  iconCircleDanger: {
    backgroundColor: colors.dangerContainer,
  },
  iconCirclePrimary: {
    backgroundColor: colors.primaryContainer,
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
  confirmDanger: {
    backgroundColor: colors.danger,
  },
  confirmPrimary: {
    backgroundColor: colors.primary,
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
