import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { RippleButton } from "../../../components/RippleButton";
import { colors } from "../../../theme/colors";
import { spacing } from "../../../theme/spacing";
import { fontSize } from "../../../theme/typography";

// Icon size in a settings row.
const ICON_SIZE = 24;

type Props = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  onPress: () => void;
};

// One settings row: icon, label and an arrow that opens another screen.
export function SettingsRow({
  icon,
  label,
  onPress,
}: Props): React.JSX.Element {
  return (
    <RippleButton onPress={onPress} contentStyle={styles.row}>
      <MaterialIcons name={icon} size={ICON_SIZE} color={colors.textMuted} />
      <Text style={styles.label}>{label}</Text>
      <MaterialIcons
        name="chevron-right"
        size={ICON_SIZE}
        color={colors.textMuted}
      />
    </RippleButton>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  label: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.lg,
  },
});
