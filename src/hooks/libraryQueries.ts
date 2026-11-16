import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "../db/database";
import { listCategories } from "../db/queries/categories";
import { listTitlesInCategory } from "../db/queries/titleCategories";
import { removeTitle } from "../db/queries/titles";
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
