import * as React from "react";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Category } from "../../../domain/types";
import { Popup } from "../../../components/Popup";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { height, opacity } from "../../../theme/height";
import { fontSize, fontWeight } from "../../../theme/typography";

// Border width of a chosen category box.
const CHECKED_BORDER = 2;

type Props = {
  visible: boolean;
  categories: ReadonlyArray<Category>;
  // The categories the title is in now; the popup starts from these.
  checkedIds: ReadonlyArray<number>;
  onSave: (selectedIds: number[]) => void;
  onManage: () => void;
  onClose: () => void;
};

// "Add to categories" on Details: taps only change the draft, Save writes it.
export function CategoryPicker({
  visible,
  categories,
  checkedIds,
  onSave,
  onManage,
  onClose,
}: Props): React.JSX.Element {
  const [draft, setDraft] = useState<ReadonlySet<number>>(new Set());

  // Every time the popup opens, start again from what is saved.
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
    <Popup visible={visible} title="Add to categories" onClose={onClose}>
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
                style={[styles.optionText, checked && styles.optionTextChecked]}
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
    </Popup>
  );
}

const styles = StyleSheet.create({
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
    borderWidth: CHECKED_BORDER,
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
