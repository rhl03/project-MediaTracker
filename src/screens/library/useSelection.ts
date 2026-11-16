import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import type { TrackedTitle } from "../../domain/types";

// Which posters are selected on the Library screen.
export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<number>>(
    new Set(),
  );

  const selecting = selectedIds.size > 0;

  // While selecting, the phone's back button ends the selection
  // instead of leaving the app.
  useEffect(() => {
    if (!selecting) {
      return;
    }
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setSelectedIds(new Set());
        return true;
      },
    );
    return () => subscription.remove();
  }, [selecting]);

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function toggleSelected(title: TrackedTitle) {
    setSelectedIds(previous => {
      const next = new Set(previous);
      if (next.has(title.id)) {
        next.delete(title.id);
      } else {
        next.add(title.id);
      }
      return next;
    });
  }

  return { selectedIds, selecting, clearSelection, toggleSelected };
}
