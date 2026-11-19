import * as React from "react";
import type { TrackedTitle } from "../../../domain/types";
import { TitleGrid } from "../../../components/TitleGrid";
import { useCategoryTitles } from "../../../hooks/libraryQueries";
import { usePostersPerRow } from "../../../hooks/settingsQueries";

type Props = {
  categoryId: number;
  selectedIds: ReadonlySet<number>;
  onPress: (title: TrackedTitle) => void;
  onLongPress: (title: TrackedTitle) => void;
};

// One pager page on the Library tab: the poster grid of one category.
export function CategoryPage({
  categoryId,
  selectedIds,
  onPress,
  onLongPress,
}: Props): React.JSX.Element {
  const { data, isPending } = useCategoryTitles(categoryId);
  // Undefined while loading, so TitleGrid uses its default until the setting is read.
  const { data: postersPerRow } = usePostersPerRow();

  return (
    <TitleGrid
      titles={data ?? []}
      loading={isPending}
      selectedIds={selectedIds}
      onPress={onPress}
      onLongPress={onLongPress}
      columns={postersPerRow}
    />
  );
}
