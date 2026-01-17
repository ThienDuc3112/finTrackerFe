import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  monthLabel: string;
  currency: string;
  totalBudget: number;
  totalSpent: number;
  onPrev: () => void;
  onNext: () => void;
};

export function BudgetsHeader({
  theme,
  monthLabel,
  currency,
  totalBudget,
  totalSpent,
  onPrev,
  onNext,
}: Props): React.ReactElement {
  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.divider,
          borderRadius: theme.radius.xl,
        },
      ]}
    >
      <View style={styles.monthRow}>
        <Pressable
          onPress={onPrev}
          hitSlop={10}
          android_ripple={{ color: theme.colors.ripple, borderless: true }}
          style={styles.iconBtn}
        >
          <MaterialIcons
            name="chevron-left"
            size={28}
            color={theme.colors.primary}
          />
        </Pressable>

        <Text
          style={[
            styles.monthText,
            { color: theme.colors.onSurface, fontFamily: theme.fonts.rounded },
          ]}
        >
          {monthLabel}
        </Text>

        <Pressable
          onPress={onNext}
          hitSlop={10}
          android_ripple={{ color: theme.colors.ripple, borderless: true }}
          style={styles.iconBtn}
        >
          <MaterialIcons
            name="chevron-right"
            size={28}
            color={theme.colors.primary}
          />
        </Pressable>
      </View>

      <View
        style={[styles.totalsRow, { borderTopColor: theme.colors.divider }]}
      >
        <TotalBlock
          theme={theme}
          label="TOTAL BUDGET"
          value={formatMoney(currency, totalBudget)}
          valueColor={theme.colors.onSurface}
        />
        <TotalBlock
          theme={theme}
          label="TOTAL SPENT"
          value={formatMoney(currency, totalSpent)}
          valueColor={theme.colors.error}
        />
      </View>
    </View>
  );
}

function TotalBlock({
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
    <View style={styles.totalBlock}>
      <Text
        style={[styles.totalLabel, { color: theme.colors.onSurfaceVariant }]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.totalValue,
          { color: valueColor, fontFamily: theme.fonts.rounded },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function formatMoney(currency: string, amount: number): string {
  // good-enough display formatting (replace with your own util if you have one)
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    paddingVertical: 10,
    marginBottom: 16,
    overflow: "hidden",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: { fontSize: 20, fontWeight: "700" },
  totalsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  totalBlock: { flex: 1, alignItems: "center", gap: 4 },
  totalLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1.0 },
  totalValue: { fontSize: 18, fontWeight: "800" },
});
