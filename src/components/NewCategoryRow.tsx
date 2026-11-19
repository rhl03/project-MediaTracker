import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { CategoryNameError } from "../domain/category";
import { IconButton } from "./IconButton";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { fontSize } from "../theme/typography";

type Props = {
  nameError: (name: string) => CategoryNameError | null;
  onAdd: (name: string) => void;
  // Overrides the card look, e.g. a lighter background inside a popup.
  style?: StyleProp<ViewStyle>;
};

// Text field with a + button that adds a category at the end.
export function NewCategoryRow({
  nameError,
  onAdd,
  style,
}: Props): React.JSX.Element {
  const [name, setName] = useState("");
  const error = nameError(name);

  function add() {
    if (error !== null) {
      return;
    }
    onAdd(name);
    setName("");
  }

  return (
    <View style={[styles.card, style]}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          onSubmitEditing={add}
          placeholder="New category"
          placeholderTextColor={colors.textMuted}
          returnKeyType="done"
        />
        <IconButton
          name="add"
          color={error === null ? colors.primary : colors.textMuted}
          onPress={add}
        />
      </View>

      {error === "duplicate" && (
        <Text style={styles.error}>
          A category with this name already exists
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.lg,
    paddingVertical: 0,
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.xs,
    marginTop: spacing.sm,
  },
});
