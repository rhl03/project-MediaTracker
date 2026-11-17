import * as React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { IconButton } from "../../../components/IconButton";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { height } from "../../../theme/height";
import { fontSize } from "../../../theme/typography";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onBack: () => void;
};

// The search field at the top of the Search screen: back arrow + text input.
// Looks like the Library's SearchBar, but you can type in it.
export function SearchField({
  value,
  onChangeText,
  onBack,
}: Props): React.JSX.Element {
  return (
    <View style={styles.bar}>
      <IconButton name="arrow-back" color={colors.text} onPress={onBack} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search movies, series, anime"
        placeholderTextColor={colors.textMuted}
        autoFocus
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: height.bar,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.xl,
    paddingVertical: 0,
    marginLeft: spacing.md,
  },
});
