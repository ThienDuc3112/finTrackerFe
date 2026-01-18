import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import type { Transaction } from "@/types/money";
import { CategoryMetaAtom } from "@/contexts/init";
import { useAtomValue } from "jotai";

type Props = {
  theme: MaterialTheme;
  item: Transaction;
  onPress?: (txn: Transaction) => void; // now: open modal
};

export function TransactionRow({ theme, item, onPress }: Props) {
  const getMeta = useAtomValue(CategoryMetaAtom);
  const meta = getMeta(theme, item.category);

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      android_ripple={{ color: theme.colors.ripple }}
      style={({ pressed }) => [
        styles.row,
        {
          paddingHorizontal: theme.spacing.md,
          borderBottomColor: theme.colors.divider,
          backgroundColor:
            pressed && Platform.OS === "ios"
              ? theme.colors.surfaceVariant
              : "transparent",
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: meta.color, borderRadius: theme.radius.pill },
        ]}
      >
        <Ionicons name={meta.iconName} size={22} color="#fff" />
      </View>

      <View style={styles.mid}>
        <Text style={[styles.category, { color: theme.colors.onBackground }]}>
          {item.category}
        </Text>

        <View style={styles.methodRow}>
          <View
            style={[
              styles.methodIconBox,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderRadius: theme.radius.sm,
              },
            ]}
          >
            <Ionicons
              name="card-outline"
              size={16}
              color={theme.colors.onSurfaceVariant}
            />
          </View>
          <Text
            style={[styles.method, { color: theme.colors.onSurfaceVariant }]}
          >
            {item.method}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          {
            color: item.amount < 0 ? theme.colors.error : theme.colors.success,
          },
        ]}
      >
        {item.amount < 0 ? "-" : ""}S${Math.abs(item.amount).toFixed(2)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  mid: { flex: 1 },
  category: { fontSize: 18, fontWeight: "800" },
  methodRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  methodIconBox: {
    width: 24,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  method: { fontSize: 14, fontWeight: "700" },
  amount: { fontSize: 18, fontWeight: "900" },
});
