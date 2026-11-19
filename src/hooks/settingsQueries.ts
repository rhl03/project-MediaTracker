import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parsePostersPerRow } from "../domain/postersPerRow";
import { db } from "../db/database";
import { getSetting, setSetting } from "../db/queries/settings";

// Key of the posters-per-row row in the settings table.
const POSTERS_PER_ROW_KEY = "postersPerRow";

// TanStack Query key for the posters-per-row setting.
const postersPerRowQueryKey = ["settings", POSTERS_PER_ROW_KEY] as const;

// How many posters the Library grid shows per row.
export function usePostersPerRow() {
  return useQuery({
    queryKey: postersPerRowQueryKey,
    queryFn: async () =>
      parsePostersPerRow(await getSetting(db, POSTERS_PER_ROW_KEY)),
    staleTime: Infinity,
  });
}

// Saves posters per row; the cache changes at once so Library updates without waiting.
export function useSetPostersPerRow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (count: number) => {
      await setSetting(db, POSTERS_PER_ROW_KEY, String(count));
    },
    onMutate: async count => {
      await queryClient.cancelQueries({ queryKey: postersPerRowQueryKey });
      queryClient.setQueryData<number>(postersPerRowQueryKey, count);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postersPerRowQueryKey });
    },
  });
}
