import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { MaterialTheme } from "@/constants/theme";
import type { Category } from "@/types/money";
import { resolveCategoryColor } from "./utils";

type Props = {
  theme: MaterialTheme;
  item: Category;
  onPress: (c: Category) => void;
  onMenu: (c: Category) => void;
};

export function CategoryRow({ theme, item, onPress, onMenu }: Props) {
  console.log(item);
  const bg = resolveCategoryColor(theme, item.colorKey);
  const iconName = item.iconName ?? "pricetag";

  return (
    <Pressable
      onPress={() => onPress(item)}
      android_ripple={{ color: theme.colors.ripple }}
      style={[styles.row, { paddingHorizontal: theme.spacing.lg }]}
    >
      <View style={[styles.iconPill, { backgroundColor: bg }]}>
        <Ionicons
          name={iconName as any}
          size={20}
          color={theme.colors.onPrimary}
        />
      </View>

      <Text style={[styles.name, { color: theme.colors.onBackground }]}>
        {item.name}
      </Text>

      <Pressable
        onPress={(e: any) => {
          e?.stopPropagation?.();
          onMenu(item);
        }}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.menuBtn}
        hitSlop={10}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={18}
          color={theme.colors.onSurfaceVariant}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});
