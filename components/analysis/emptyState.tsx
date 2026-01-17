import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  title?: string;
  subtitle?: string;
};

export function EmptyState({
  theme,
  title = "No expenses this month",
  subtitle = "Try another month.",
}: Props): React.ReactElement {
  return (
    <View style={{ paddingTop: theme.spacing.lg, paddingHorizontal: 4 }}>
      <View style={styles.row}>
        <MaterialIcons
          name="event-busy"
          size={18}
          color={theme.colors.onSurfaceVariant}
        />
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          {title}
        </Text>
      </View>

      <Text style={[styles.sub, { color: theme.colors.onSurfaceVariant }]}>
        {subtitle}
      </Text>

      <View
        style={[
          styles.divider,
          {
            backgroundColor: theme.colors.divider,
            marginTop: theme.spacing.md,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 16, fontWeight: "800" },
  sub: { marginTop: 6, fontSize: 13, lineHeight: 18 },
  divider: { height: StyleSheet.hairlineWidth, opacity: 0.8 },
});
