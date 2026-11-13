import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  View,
} from "react-native";
import type { Category } from "../domain/types";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { fontSize } from "../theme/typography";

type Props = {
  categories: ReadonlyArray<Pick<Category, "id" | "name">>;
  // Pager position + swipe offset, e.g. 1.4 = 40 % of the way from tab 1 to 2.
  progress: Animated.Value;
  onSelect: (index: number) => void;
};

// Where a tab sits inside the row, measured with onLayout.
type TabLayout = { x: number; width: number };

// Category tabs centred side by side with the same spacing; the row scrolls
// when they don't fit. The underline follows the pager while swiping.
export function CategoryTabs({
  categories,
  progress,
  onSelect,
}: Props): React.JSX.Element {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [rowWidth, setRowWidth] = useState(0);
  // The tab closest to the pager's position. Kept here so only the tab row
  // re-renders when it changes, not the whole screen with its grids.
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [layouts, setLayouts] = useState<ReadonlyArray<TabLayout | undefined>>(
    [],
  );

  // Follows progress; React skips the re-render when the index is unchanged.
  useEffect(() => {
    const id = progress.addListener(({ value }) => {
      setSelectedIndex(Math.round(value));
    });
    return () => progress.removeListener(id);
  }, [progress]);

  // Keep the selected tab in the middle of the row when the row scrolls.
  // scrollTo stops at the ends by itself, so the first and last tabs stay put.
  const selected = layouts[selectedIndex];
  useEffect(() => {
    if (selected === undefined || rowWidth === 0) {
      return;
    }
    const x = selected.x + selected.width / 2 - rowWidth / 2;
    scrollRef.current?.scrollTo({ x: Math.max(0, x), animated: true });
  }, [selected, rowWidth]);

  function onTabLayout(index: number, e: LayoutChangeEvent) {
    const { x, width } = e.nativeEvent.layout;
    setLayouts(previous => {
      const next = [...previous];
      next[index] = { x, width };
      return next;
    });
  }

  const measured: TabLayout[] = [];
  for (let i = 0; i < categories.length; i++) {
    const layout = layouts[i];
    if (layout === undefined) {
      break;
    }
    measured.push(layout);
  }
  const allMeasured =
    categories.length > 0 && measured.length === categories.length;

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.content}
      onLayout={e => setRowWidth(e.nativeEvent.layout.width)}
    >
      {categories.map((category, index) => {
        const color = progress.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [colors.textMuted, colors.primary, colors.textMuted],
          extrapolate: "clamp",
        });
        return (
          <Pressable
            key={category.id}
            onPress={() => onSelect(index)}
            onLayout={e => onTabLayout(index, e)}
            style={styles.tab}
          >
            <Animated.Text style={[styles.label, { color }]} numberOfLines={1}>
              {category.name}
            </Animated.Text>
          </Pressable>
        );
      })}

      {allMeasured && <Indicator layouts={measured} progress={progress} />}
    </ScrollView>
  );
}

// The underline: slides and stretches between the tabs' label widths.
function Indicator({
  layouts,
  progress,
}: {
  layouts: TabLayout[];
  progress: Animated.Value;
}): React.JSX.Element {
  const lefts = layouts.map(layout => layout.x + spacing.md);
  const widths = layouts.map(layout => layout.width - spacing.md * 2);

  // interpolate needs at least two points; with one tab it just stays put.
  if (layouts.length === 1) {
    return (
      <View style={[styles.indicator, { left: lefts[0], width: widths[0] }]} />
    );
  }

  const inputRange = layouts.map((_, index) => index);
  const left = progress.interpolate({
    inputRange,
    outputRange: lefts,
    extrapolate: "clamp",
  });
  const width = progress.interpolate({
    inputRange,
    outputRange: widths,
    extrapolate: "clamp",
  });

  return <Animated.View style={[styles.indicator, { left, width }]} />;
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 0,
    marginTop: spacing.sm,
  },
  // At least as wide as the row so the tabs can be centred; wider when they
  // don't fit, which makes the row scroll.
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg - spacing.md,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: fontSize.xl,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
