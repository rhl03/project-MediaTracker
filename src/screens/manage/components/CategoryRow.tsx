import * as React from "react";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { useReorderableDrag } from "react-native-reorderable-list";
import type { CategoryNameError } from "../../../domain/category";
import type { Category } from "../../../domain/types";
import { IconButton } from "../../../components/IconButton";
import { RippleButton } from "../../../components/RippleButton";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { fontSize } from "../../../theme/typography";
import { titleCount } from "../titleCount";

// How long the handle must be held before the row starts dragging.
const DRAG_DELAY_MS = 150;

type Props = {
  category: Category;
  count: number;
  canDelete: boolean;
  nameError: (name: string) => CategoryNameError | null;
  onRename: (name: string) => void;
  onDelete: () => void;
};

// One category: drag handle, name with title count (tap to rename) and delete.
export function CategoryRow({
  category,
  count,
  canDelete,
  nameError,
  onRename,
  onDelete,
}: Props): React.JSX.Element {
  const drag = useReorderableDrag();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(category.name);
  const error = nameError(draft);

  function startEditing() {
    setDraft(category.name);
    setEditing(true);
  }

  function save() {
    if (error !== null) {
      return;
    }
    if (draft.trim() !== category.name) {
      onRename(draft);
    }
    setEditing(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable
          onLongPress={drag}
          delayLongPress={DRAG_DELAY_MS}
          hitSlop={spacing.sm}
        >
          <MaterialIcons
            name="drag-handle"
            size={24}
            color={colors.textMuted}
          />
        </Pressable>

        {editing ? (
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={save}
            autoFocus
            selectTextOnFocus
            returnKeyType="done"
          />
        ) : (
          <RippleButton
            onPress={startEditing}
            style={styles.texts}
            contentStyle={styles.textsInner}
          >
            <Text style={styles.name} numberOfLines={1}>
              {category.name}
            </Text>
            <Text style={styles.count}>{titleCount(count)}</Text>
          </RippleButton>
        )}

        {editing ? (
          <>
            <IconButton
              name="close"
              color={colors.textMuted}
              onPress={() => setEditing(false)}
            />
            <IconButton
              name="check"
              color={error === null ? colors.primary : colors.textMuted}
              onPress={save}
            />
          </>
        ) : canDelete ? (
          <IconButton
            name="delete-outline"
            color={colors.danger}
            onPress={onDelete}
          />
        ) : null}
      </View>

      {editing && error === "duplicate" && (
        <Text style={styles.error}>
          A category with this name already exists
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  texts: {
    flex: 1,
    borderRadius: radius.sm,
  },
  textsInner: {
    paddingVertical: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  count: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.lg,
    paddingVertical: 0,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
  },
});
