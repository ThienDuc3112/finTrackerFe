import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { CategoryMetaAtom } from "@/contexts/init";
import { useAtomValue } from "jotai";

type Props = {
  theme: MaterialTheme;
  category: string;
  onSetBudget: () => void;
};

export function NotBudgetedRow({
  theme,
  category,
  onSetBudget,
}: Props): React.ReactElement {
  const getMeta = useAtomValue(CategoryMetaAtom);
  const meta = getMeta(theme, category);

  return (
    <View style={[styles.row, { paddingHorizontal: theme.spacing.md }]}>
      <View style={[styles.iconWrap, { backgroundColor: meta.color }]}>
        <Ionicons
          name={meta.iconName}
          size={18}
          color={theme.colors.onPrimary}
        />
      </View>

      <Text
        style={[
          styles.name,
          { color: theme.colors.onSurface, fontFamily: theme.fonts.rounded },
        ]}
      >
        {category}
      </Text>

      <Pressable
        onPress={onSetBudget}
        android_ripple={{ color: theme.colors.ripple }}
        style={[
          styles.btn,
          {
            borderColor: theme.colors.primary,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <Text style={[styles.btnText, { color: theme.colors.primary }]}>
          SET BUDGET
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { flex: 1, fontSize: 16, fontWeight: "800" },
  btn: {
    borderWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  btnText: { fontSize: 12, fontWeight: "900", letterSpacing: 1.0 },
});
