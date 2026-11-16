import { useQuery } from "@tanstack/react-query";
import { db } from "../db/database";
import { listCategories } from "../db/queries/categories";
import { listTitlesInCategory } from "../db/queries/titleCategories";

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
