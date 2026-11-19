import { useState } from "react";
import { DEFAULT_POSTERS_PER_ROW } from "../../domain/postersPerRow";
import {
  usePostersPerRow,
  useSetPostersPerRow,
} from "../../hooks/settingsQueries";

// State for Settings: posters per row and whether the categories popup is open.
export function useSettings() {
  const { data: savedPostersPerRow = DEFAULT_POSTERS_PER_ROW } =
    usePostersPerRow();
  const { mutate: savePostersPerRow } = useSetPostersPerRow();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [draggingPostersPerRow, setDraggingPostersPerRow] = useState<
    number | null
  >(null);

  // Shows the number under the finger while dragging.
  function slidePostersPerRow(value: number) {
    setDraggingPostersPerRow(Math.round(value));
  }

  // Saves the number when the finger lets go.
  function releasePostersPerRow(value: number) {
    savePostersPerRow(Math.round(value));
    setDraggingPostersPerRow(null);
  }

  return {
    categoriesOpen,
    setCategoriesOpen,
    savedPostersPerRow,
    shownPostersPerRow: draggingPostersPerRow ?? savedPostersPerRow,
    slidePostersPerRow,
    releasePostersPerRow,
  };
}
