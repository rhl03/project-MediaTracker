import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Episode,
  LoadedDetails,
  MediaType,
  SeasonSummary,
} from "../domain/types";
import { episodesUpTo } from "../domain/progress";
import { toNewTitle } from "../domain/newTitle";
import { db } from "../db/database";
import { listCategories } from "../db/queries/categories";
import {
  addToCategory,
  listCategoryIdsForTitle,
  listTitlesInCategory,
  removeFromCategory,
} from "../db/queries/titleCategories";
import {
  addTitle,
  getTitle,
  markMovieWatched,
  removeTitle,
} from "../db/queries/titles";
import {
  listWatched,
  markEpisodes,
  resetProgress,
  unmarkEpisode,
} from "../db/queries/episodes";

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

// A TMDB title as saved in the database, or null when it isn't saved yet.
export function useSavedTitle(mediaType: MediaType, tmdbId: number) {
  return useQuery({
    queryKey: ["savedTitle", mediaType, tmdbId],
    queryFn: async () => (await getTitle(db, tmdbId, mediaType)) ?? null,
    staleTime: Infinity,
  });
}

// The watched episodes of a saved title; waits until there is an id.
export function useWatchedEpisodes(titleId: number | undefined) {
  return useQuery({
    queryKey: ["watched", titleId],
    queryFn: () => listWatched(db, titleId ?? 0),
    enabled: titleId !== undefined,
    staleTime: Infinity,
  });
}

// Deletes titles with their progress, then reloads everything that shows them.
export function useRemoveTitles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await removeTitle(db, id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] });
      queryClient.invalidateQueries({ queryKey: ["savedTitle"] });
      queryClient.invalidateQueries({ queryKey: ["titleCategories"] });
      queryClient.invalidateQueries({ queryKey: ["watched"] });
    },
  });
}

// Unmarks every episode and the movie watched flag of the titles, then reloads progress.
export function useResetProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await resetProgress(db, id);
        await markMovieWatched(db, id, false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] });
      queryClient.invalidateQueries({ queryKey: ["savedTitle"] });
      queryClient.invalidateQueries({ queryKey: ["watched"] });
    },
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

// Saves the picker's choice: saves the title if needed, adds new categories, removes unticked ones.
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
      queryClient.invalidateQueries({ queryKey: ["savedTitle"] });
    },
  });
}

// Ticks an episode and every one before it, or unticks only that episode.
export function useToggleEpisode(
  titleId: number | undefined,
  seasons: ReadonlyArray<SeasonSummary>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (change: { episode: Episode; watched: boolean }) => {
      if (titleId === undefined) {
        return;
      }
      const ref = {
        seasonNumber: change.episode.seasonNumber,
        episodeNumber: change.episode.episodeNumber,
      };
      if (change.watched) {
        await unmarkEpisode(db, titleId, ref);
      } else {
        await markEpisodes(db, titleId, episodesUpTo(seasons, ref), Date.now());
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watched"] });
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] });
    },
  });
}

// Marks a saved movie as watched or not watched.
export function useMarkMovieWatched(titleId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (watched: boolean) => {
      if (titleId === undefined) {
        return;
      }
      await markMovieWatched(db, titleId, watched);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedTitle"] });
      queryClient.invalidateQueries({ queryKey: ["categoryTitles"] });
    },
  });
}
