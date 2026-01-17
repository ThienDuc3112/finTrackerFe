import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  expenseText: string;
  incomeText: string;
  totalText: string;
  totalIsNegative: boolean;
};

function SummaryCell({
  theme,
  label,
  value,
  valueColor,
}: {
  theme: MaterialTheme;
  label: string;
  value: string;
  valueColor: string;
}): React.ReactElement {
  return (
    <View style={styles.cell}>
      <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        {label}
      </Text>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export function MoneySummaryRow({
  theme,
  expenseText,
  incomeText,
  totalText,
  totalIsNegative,
}: Props): React.ReactElement {
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.divider,
        },
      ]}
    >
      <SummaryCell
        theme={theme}
        label="EXPENSE"
        value={expenseText}
        valueColor={theme.colors.error}
      />
      <SummaryCell
        theme={theme}
        label="INCOME"
        value={incomeText}
        valueColor={theme.colors.success}
      />
      <SummaryCell
        theme={theme}
        label="TOTAL"
        value={totalText}
        valueColor={totalIsNegative ? theme.colors.error : theme.colors.success}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cell: { flex: 1, alignItems: "center", gap: 6 },
  label: { fontSize: 12, letterSpacing: 0.6, fontWeight: "700" },
  value: { fontSize: 18, fontWeight: "800" },
});
