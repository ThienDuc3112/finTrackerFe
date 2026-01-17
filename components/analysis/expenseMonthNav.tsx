import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onFilter?: () => void;
};

export function ExpenseMonthNav({
  theme,
  label,
  onPrev,
  onNext,
  onFilter,
}: Props): React.ReactElement {
  return (
    <View style={[styles.root, { paddingVertical: theme.spacing.sm }]}>
      <Pressable
        onPress={onPrev}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.btn}
      >
        <MaterialIcons
          name="chevron-left"
          size={28}
          color={theme.colors.primary}
        />
      </Pressable>

      <Text
        style={[styles.label, { color: theme.colors.primary }]}
        numberOfLines={1}
      >
        {label}
      </Text>

      <Pressable
        onPress={onNext}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.btn}
      >
        <MaterialIcons
          name="chevron-right"
          size={28}
          color={theme.colors.primary}
        />
      </Pressable>

      <Pressable
        onPress={onFilter}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={[styles.btn, { marginLeft: theme.spacing.sm }]}
      >
        <MaterialIcons name="tune" size={22} color={theme.colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  label: {
    fontSize: 22,
    fontWeight: "700",
    minWidth: 170,
    textAlign: "center",
  },
});
