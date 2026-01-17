import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  theme: MaterialTheme;
  category: string;
  amountText: string;
  pct: number; // 0..1
  color: string;

  selected?: boolean;
  onPress?: () => void;
};

function iconForCategory(category: string): IoniconName {
  switch (category) {
    case "Shopping":
      return "cart";
    case "Food":
      return "restaurant";
    case "Drinks":
      return "wine";
    case "Grocery":
    case "Groceries":
      return "basket";
    case "Transportation":
      return "bus";
    case "Entertainment":
      return "film";
    case "Bills":
      return "receipt";
    case "Health":
      return "medkit";
    case "Transfer":
      return "swap-horizontal";
    case "Income":
      return "cash";
    default:
      return "pricetag";
  }
}

export function CategoryRow({
  theme,
  category,
  amountText,
  pct,
  color,
  selected = false,
  onPress,
}: Props): React.ReactElement {
  const pctText = `${(pct * 100).toFixed(2)}%`;

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: theme.colors.ripple }}
      style={[
        styles.root,
        {
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radius.lg,
          backgroundColor: selected ? theme.colors.surface : "transparent",
          borderWidth: selected ? 2 : 0,
          borderColor: selected ? theme.colors.primary : "transparent",
        },
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: color, borderRadius: theme.radius.pill },
          ]}
        >
          <Ionicons
            name={iconForCategory(category)}
            size={22}
            color={theme.colors.onPrimary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.onBackground },
                selected && { fontWeight: "900" },
              ]}
              numberOfLines={1}
            >
              {category}
            </Text>

            <Text
              style={[
                styles.amount,
                { color: theme.colors.error },
                selected && { opacity: 1 },
              ]}
              numberOfLines={1}
            >
              {amountText}
            </Text>
          </View>

          <View
            style={[
              styles.barTrack,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: theme.radius.pill,
              },
            ]}
          >
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.max(0, Math.min(1, pct)) * 100}%`,
                  backgroundColor: selected
                    ? theme.colors.primary
                    : theme.colors.primary,
                  opacity: selected ? 1 : 0.75,
                  borderRadius: theme.radius.pill,
                },
              ]}
            />
          </View>
        </View>

        <Text
          style={[
            styles.pct,
            { color: theme.colors.onBackground },
            selected && { fontWeight: "900" },
          ]}
        >
          {pctText}
        </Text>
      </View>

      <View
        style={{
          marginTop: theme.spacing.md,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.divider,
          opacity: selected ? 0.6 : 1,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: 10, paddingHorizontal: 2 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: { fontSize: 18, fontWeight: "800" },
  amount: { fontSize: 16, fontWeight: "900" },
  barTrack: { height: 12, overflow: "hidden", marginTop: 10 },
  barFill: { height: "100%" },
  pct: { width: 76, textAlign: "right", fontSize: 14, fontWeight: "800" },
});
