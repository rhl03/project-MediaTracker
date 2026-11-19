import { useState } from "react";
import type { ReorderableListReorderEvent } from "react-native-reorderable-list";
import type { Category } from "../domain/types";
import { canRemoveCategory, categoryNameError } from "../domain/category";
import {
  useAddCategory,
  useCategories,
  useCategoryCounts,
  useDeleteCategory,
  useMoveCategory,
  useRenameCategory,
} from "./libraryQueries";

// State and actions for managing categories: list, counts, add, rename, move, delete.
export function useManageCategories() {
  const { data: categories = [] } = useCategories();
  const { data: counts = {} } = useCategoryCounts();
  const { mutate: addCategory } = useAddCategory();
  const { mutate: renameCategory } = useRenameCategory();
  const { mutate: moveCategory } = useMoveCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const [deleting, setDeleting] = useState<Category | null>(null);

  // Why a name can't be saved, or null; ignoreId skips the category being renamed.
  function nameError(name: string, ignoreId?: number) {
    return categoryNameError(name, categories, ignoreId);
  }

  function add(name: string) {
    addCategory(name);
  }

  function rename(id: number, name: string) {
    renameCategory({ id, name });
  }

  // Saves the new place after a row is dropped.
  function reorder({ from, to }: ReorderableListReorderEvent) {
    const moved = categories[from];
    if (moved !== undefined && from !== to) {
      moveCategory({ id: moved.id, toPlace: to });
    }
  }

  function confirmDelete() {
    if (deleting !== null) {
      deleteCategory(deleting.id);
    }
    setDeleting(null);
  }

  return {
    categories,
    counts,
    canDelete: canRemoveCategory(categories),
    deleting,
    setDeleting,
    nameError,
    add,
    rename,
    reorder,
    confirmDelete,
  };
}
