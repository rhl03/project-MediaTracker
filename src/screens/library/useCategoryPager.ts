import { useRef } from "react";
import { Animated } from "react-native";
import type {
  PagerViewOnPageScrollEvent,
  PagerViewRef,
} from "react-native-pager-view";

// The category pager on the Library screen: the pager ref, the swipe
// position for the tab underline, tab taps and the pager's scroll events.
export function useCategoryPager(
  selecting: boolean,
  clearSelection: () => void,
) {
  const pagerRef = useRef<PagerViewRef>(null);
  // Pager position + swipe offset, drives the tab underline and colours.
  const progress = useRef(new Animated.Value(0)).current;
  // True while a tab tap animates the underline; pager scroll events wait.
  const tapping = useRef(false);

  // Tapping a tab ends the selection, slides the underline to the tab
  // and moves the pager to that category.
  function selectTab(index: number) {
    if (selecting) {
      clearSelection();
    }
    tapping.current = true;
    Animated.timing(progress, {
      toValue: index,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      tapping.current = false;
    });
    pagerRef.current?.setPage(index);
  }

  // Follows the swipe, except while a tab tap is animating the underline.
  function onPageScroll(e: PagerViewOnPageScrollEvent) {
    if (!tapping.current) {
      progress.setValue(e.nativeEvent.position + e.nativeEvent.offset);
    }
  }

  return { pagerRef, progress, selectTab, onPageScroll };
}
