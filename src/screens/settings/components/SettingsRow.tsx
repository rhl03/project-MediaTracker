import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { RippleButton } from "../../../components/RippleButton";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontSize } from "../../../theme/typography";

// Icon size in every settings row; SliderRow uses it to line up too.
export const ICON_SIZE = 24;

// Space between the icon and the text in every settings row.
export const ICON_GAP = spacing.lg;

type Props = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  // Gray line under the label, e.g. the current value.
  summary?: string;
  onPress: () => void;
};

// One tappable settings row inside a card: icon, label and an optional summary.
export function SettingsRow({
  icon,
  label,
  summary,
  onPress,
}: Props): React.JSX.Element {
  return (
    <RippleButton onPress={onPress} contentStyle={styles.row}>
      <MaterialIcons name={icon} size={ICON_SIZE} color={colors.primary} />
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        {summary !== undefined && <Text style={styles.summary}>{summary}</Text>}
      </View>
    </RippleButton>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: ICON_GAP,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  texts: {
    flex: 1,
  },
  label: {
    color: colors.text,
    fontSize: fontSize.lg,
  },
  summary: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
});
