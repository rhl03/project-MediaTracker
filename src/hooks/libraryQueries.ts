import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoadedDetails, MediaType } from "../domain/types";
import { toNewTitle } from "../domain/newTitle";
import { db } from "../db/database";
import { listCategories } from "../db/queries/categories";
import {
  addToCategory,
  listCategoryIdsForTitle,
  listTitlesInCategory,
  removeFromCategory,
} from "../db/queries/titleCategories";
import { addTitle, getTitle, removeTitle } from "../db/queries/titles";
import { resetProgress } from "../db/queries/episodes";

// All categories, in tab order.
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories(db),
    staleTime: Infinity,
  });
}

// The titles in one category, newest added first.
export function useCategoryTitles(categoryId: number) {
  return useQuery({
    queryKey: ["categoryTitles", categoryId],
    queryFn: () => listTitlesInCategory(db, categoryId),
    staleTime: Infinity,
  });
}

// Deletes titles completely, progress included, then reloads every category.
export function useRemoveTitles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await removeTitle(db, id);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] }),
  });
}

// Unmarks every episode of the titles, then reloads every category.
export function useResetProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await resetProgress(db, id);
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] }),
  });
}

// The categories a TMDB title is in; [] when it isn't saved yet.
export function useTitleCategoryIds(mediaType: MediaType, tmdbId: number) {
  return useQuery({
    queryKey: ["titleCategories", mediaType, tmdbId],
    queryFn: async () => {
      const title = await getTitle(db, tmdbId, mediaType);
      return title ? listCategoryIdsForTitle(db, title.id) : [];
    },
    staleTime: Infinity,
  });
}

// Saves the categories chosen in the picker: adds the new ones and removes the
// unticked ones. Saves the title first if needed (addTitle returns the existing
// id when it's already saved). Does nothing when nothing changed.
export function useSaveCategories(loaded: LoadedDetails | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (change: {
      previousIds: ReadonlyArray<number>;
      selectedIds: ReadonlyArray<number>;
    }) => {
      if (loaded === undefined) {
        return;
      }
      const toAdd = change.selectedIds.filter(
        id => !change.previousIds.includes(id),
      );
      const toRemove = change.previousIds.filter(
        id => !change.selectedIds.includes(id),
      );
      if (toAdd.length === 0 && toRemove.length === 0) {
        return;
      }
      const titleId = await addTitle(db, toNewTitle(loaded));
      for (const categoryId of toAdd) {
        await addToCategory(db, titleId, categoryId);
      }
      for (const categoryId of toRemove) {
        await removeFromCategory(db, titleId, categoryId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["titleCategories"] });
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] });
    },
  });
}
