import * as React from "react";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Category } from "../../../domain/types";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { height, opacity } from "../../../theme/height";
import { fontSize, fontWeight } from "../../../theme/typography";

type Props = {
  visible: boolean;
  categories: ReadonlyArray<Category>;
  // The categories the title is in now; the window starts from these.
  checkedIds: ReadonlyArray<number>;
  onSave: (selectedIds: number[]) => void;
  onManage: () => void;
  onClose: () => void;
};

// The "Add to categories" window on Details: one long box per category, blue
// when chosen. Taps only change the window; Save writes them, closing any
// other way throws them away.
export function CategoryPicker({
  visible,
  categories,
  checkedIds,
  onSave,
  onManage,
  onClose,
}: Props): React.JSX.Element {
  const [draft, setDraft] = useState<ReadonlySet<number>>(new Set());

  // Every time the window opens, start again from what is saved.
  useEffect(() => {
    if (visible) {
      setDraft(new Set(checkedIds));
    }
  }, [visible, checkedIds]);

  function toggle(categoryId: number) {
    setDraft(previous => {
      const next = new Set(previous);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.title}>Add to categories</Text>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
          >
            {categories.map(category => {
              const checked = draft.has(category.id);
              return (
                <Pressable
                  key={category.id}
                  style={({ pressed }) => [
                    styles.option,
                    checked && styles.optionChecked,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => toggle(category.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      checked && styles.optionTextChecked,
                    ]}
                    numberOfLines={1}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.buttons}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.manage,
                pressed && styles.pressed,
              ]}
              onPress={onManage}
            >
              <Text style={styles.manageText}>Manage</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.save,
                pressed && styles.pressed,
              ]}
              onPress={() => onSave([...draft])}
            >
              <Text style={styles.saveText}>Save</Text>
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
    maxHeight: "80%",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    gap: spacing.sm,
  },
  option: {
    height: height.button,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: colors.surface2,
  },
  optionChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryContainer,
  },
  optionText: {
    color: colors.text,
    fontSize: fontSize.xl,
  },
  optionTextChecked: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  button: {
    flex: 1,
    height: height.button,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
  },
  manage: {
    backgroundColor: colors.surface3,
  },
  save: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  manageText: {
    color: colors.text,
    fontWeight: fontWeight.bold,
  },
  saveText: {
    color: colors.background,
    fontWeight: fontWeight.bold,
  },
});
