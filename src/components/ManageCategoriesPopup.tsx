import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  type ListRenderItemInfo,
} from "react-native";
import ReorderableList from "react-native-reorderable-list";
import type { Category } from "../domain/types";
import { deleteCategoryMessage } from "../domain/categoryText";
import { useManageCategories } from "../hooks/useManageCategories";
import { colors } from "../theme/colors";
import { height, opacity } from "../theme/height";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { fontWeight } from "../theme/typography";
import { CategoryRow } from "./CategoryRow";
import { ConfirmDialog } from "./ConfirmDialog";
import { NewCategoryRow } from "./NewCategoryRow";
import { Popup } from "./Popup";

type Props = {
  visible: boolean;
  onClose: () => void;
};

// Manage categories in a popup: drag to reorder, tap to rename, delete, and add new ones.
export function ManageCategoriesPopup({
  visible,
  onClose,
}: Props): React.JSX.Element {
  const {
    categories,
    counts,
    canDelete,
    deleting,
    setDeleting,
    nameError,
    add,
    rename,
    reorder,
    confirmDelete,
  } = useManageCategories();

  const deletingCount = deleting === null ? 0 : counts[deleting.id] ?? 0;

  function renderItem({ item }: ListRenderItemInfo<Category>) {
    return (
      <CategoryRow
        category={item}
        count={counts[item.id] ?? 0}
        canDelete={canDelete}
        nameError={name => nameError(name, item.id)}
        onRename={name => rename(item.id, name)}
        onDelete={() => setDeleting(item)}
      />
    );
  }

  return (
    <>
      {/* Hidden while the delete warning shows, so two modals never stack. */}
      <Popup
        visible={visible && deleting === null}
        title="Categories"
        onClose={onClose}
      >
        <ReorderableList
          style={styles.list}
          data={categories}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          onReorder={reorder}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={
            <NewCategoryRow
              style={styles.newRow}
              nameError={nameError}
              onAdd={add}
            />
          }
        />

        <Pressable
          style={({ pressed }) => [styles.done, pressed && styles.pressed]}
          onPress={onClose}
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </Popup>

      <ConfirmDialog
        visible={deleting !== null}
        icon="delete-outline"
        title={`Delete ${deleting?.name ?? ""}?`}
        message={deleteCategoryMessage(deletingCount)}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
  },
  newRow: {
    marginTop: 0,
    borderRadius: radius.xl,
    backgroundColor: colors.surface2,
  },
  done: {
    height: height.button,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    marginTop: spacing.xl,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  doneText: {
    color: colors.background,
    fontWeight: fontWeight.bold,
  },
});
