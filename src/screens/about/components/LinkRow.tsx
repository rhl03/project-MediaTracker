import * as React from "react";
import { Linking, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import { RippleButton } from "../../../components/RippleButton";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { fontSize } from "../../../theme/typography";

type Props = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  label: string;
  url: string;
};

// A card row that opens a website in the browser.
export function LinkRow({ icon, label, url }: Props): React.JSX.Element {
  return (
    <RippleButton
      onPress={() => void Linking.openURL(url)}
      style={styles.card}
      contentStyle={styles.row}
    >
      <MaterialIcons name={icon} size={22} color={colors.primary} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <MaterialIcons name="open-in-new" size={18} color={colors.textMuted} />
    </RippleButton>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  label: {
    flex: 1,
    color: colors.primary,
    fontSize: fontSize.md,
  },
});
