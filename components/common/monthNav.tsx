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

export function MonthNav({
  theme,
  label,
  onPrev,
  onNext,
  onFilter,
}: Props): React.ReactElement {
  return (
    <View style={[styles.root, { paddingHorizontal: theme.spacing.md }]}>
      <Pressable
        onPress={onPrev}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.btn}
      >
        <MaterialIcons
          name="chevron-left"
          size={26}
          color={theme.colors.primary}
        />
      </Pressable>

      <Text style={[styles.label, { color: theme.colors.primary }]}>
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
          size={26}
          color={theme.colors.primary}
        />
      </Pressable>

      <View style={{ flex: 1 }} />

      <Pressable
        onPress={onFilter}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.btn}
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
    paddingBottom: 6,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 6,
  },
});
