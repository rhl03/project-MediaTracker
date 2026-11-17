import * as React from "react";
import { StyleSheet, View, type ListRenderItemInfo } from "react-native";
import ReorderableList from "react-native-reorderable-list";
import type { Category } from "../../domain/types";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { spacing } from "../../theme/spacing";
import { CategoryRow } from "./components/CategoryRow";
import { NewCategoryRow } from "./components/NewCategoryRow";
import { titleCount } from "./titleCount";
import { useManageCategories } from "./useManageCategories";

// Manage categories: drag to reorder, tap to rename, delete, and add new ones.
export function ManageScreen(): React.JSX.Element {
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
  const deleteMessage =
    deletingCount === 0
      ? "It has no titles."
      : `${titleCount(
          deletingCount,
        )} will only lose this category. Progress is kept.`;

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
    <View style={styles.container}>
      <ReorderableList
        data={categories}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        onReorder={reorder}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <NewCategoryRow nameError={nameError} onAdd={add} />
        }
      />

      <ConfirmDialog
        visible={deleting !== null}
        icon="delete-outline"
        title={`Delete ${deleting?.name ?? ""}?`}
        message={deleteMessage}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
