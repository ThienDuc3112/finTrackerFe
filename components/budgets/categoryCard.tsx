import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import type { BudgetedCategory } from "@/app/(tabs)/budgets";
import { BudgetProgressBar } from "@/components/budgets/progressBar";
import { categoryMeta, TransactionsAtom } from "@/contexts/init";
import { useAtom } from "jotai";

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

type Props = {
  theme: MaterialTheme;
  item: BudgetedCategory; // uses category, limit, currency (spent is ignored)
  month: Date; // <-- pass cursor month from budgets.tsx
  monthLabel: string;
  onMore?: () => void;
};

export function BudgetCategoryCard({
  theme,
  item,
  month,
  monthLabel,
  onMore,
}: Props): React.ReactElement {
  const [txns] = useAtom(TransactionsAtom);

  // Compute spent from TransactionsAtom for this category + month
  const spent = React.useMemo(() => {
    let s = 0;
    for (const t of txns) {
      if (!isSameMonth(t.occurredAt, month)) continue;
      if (t.category !== item.category) continue;
      if (t.amount >= 0) continue; // only expenses
      s += -t.amount; // abs expense
    }
    return s;
  }, [txns, item.category, month.getFullYear(), month.getMonth()]);

  const remaining = Math.max(item.limit - spent, 0);
  const isOver = spent > item.limit;
  const pct = item.limit <= 0 ? 0 : Math.min(spent / item.limit, 1);

  const meta = categoryMeta(theme, item.category);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.divider,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: meta.color }]}>
          <Ionicons
            name={meta.iconName}
            size={18}
            color={theme.colors.onPrimary}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.onSurface,
                fontFamily: theme.fonts.rounded,
              },
            ]}
          >
            {item.category}
          </Text>

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.metaText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Limit:
            </Text>
            <Text style={[styles.metaText, { color: theme.colors.onSurface }]}>
              {" "}
              {formatMoney(item.currency, item.limit)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.metaText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Spent:
            </Text>
            <Text
              style={[
                styles.metaText,
                { color: isOver ? theme.colors.error : theme.colors.success },
              ]}
            >
              {" "}
              {formatMoney(item.currency, spent)}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text
              style={[
                styles.metaText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Remaining:
            </Text>
            <Text style={[styles.metaText, { color: theme.colors.success }]}>
              {" "}
              {formatMoney(item.currency, remaining)}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", gap: 6 }}>
          <Text
            style={[styles.monthHint, { color: theme.colors.onSurfaceVariant }]}
          >
            ({monthLabel})
          </Text>

          <Pressable
            onPress={onMore}
            hitSlop={10}
            android_ripple={{ color: theme.colors.ripple, borderless: true }}
            style={styles.moreBtn}
          >
            <MaterialIcons
              name="more-horiz"
              size={22}
              color={theme.colors.onSurfaceVariant}
            />
          </Pressable>
        </View>
      </View>

      <BudgetProgressBar
        theme={theme}
        pct={pct}
        isOver={isOver}
        rightTag={formatMoney(item.currency, item.limit)}
      />
    </View>
  );
}

function formatMoney(currency: string, amount: number): string {
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
  card: { borderWidth: 1, padding: 14 },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  metaRow: { flexDirection: "row", marginTop: 2 },
  metaText: { fontSize: 13, fontWeight: "600" },
  monthHint: { fontSize: 12, fontWeight: "700" },
  moreBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
});
