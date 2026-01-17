import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import type { MaterialTheme } from "@/constants/theme";

type SummaryItem = {
  label: string;
  value: string;
  valueColor: string;
};

type Props = {
  theme: MaterialTheme;
  items: readonly SummaryItem[];
};

export function SummaryCard({ theme, items }: Props): React.ReactElement {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          marginHorizontal: theme.spacing.md,
          borderColor: theme.colors.divider,
        },
      ]}
    >
      {items.map((it) => (
        <View key={it.label} style={styles.col}>
          <Text style={[styles.label, { color: theme.colors.primary }]}>
            {it.label}
          </Text>
          <Text style={[styles.value, { color: it.valueColor }]}>
            {it.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 6,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    borderWidth: 1,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      default: {},
    }),
  },
  col: { flex: 1, alignItems: "center" },
  label: { fontSize: 12, fontWeight: "800", letterSpacing: 1.0 },
  value: { marginTop: 6, fontSize: 16, fontWeight: "800" },
});
