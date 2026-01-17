import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import type { Transaction } from "@/types/money";

// put your SAMPLE in e.g. `data/sample.ts` and import it:
import { useSetAtom } from "jotai";
import { selectedCategoryAtom } from "@/components/analysis/state";
import { SAMPLE } from "@/sampleData/sample";
import { ExpenseOverview } from "@/components/analysis/overview";

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function inSameMonth(date: Date, month: Date): boolean {
  return (
    date.getFullYear() === month.getFullYear() &&
    date.getMonth() === month.getMonth()
  );
}

function monthTitle(d: Date): string {
  return d.toLocaleDateString("en-SG", { month: "long", year: "numeric" });
}

function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function formatMoney(currency: string, amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  if (currency === "SGD") return `${sign}S$${abs.toFixed(2)}`;
  return `${sign}${abs.toFixed(2)} ${currency}`;
}

type CategoryAgg = {
  category: string;
  amountAbs: number;
  amountSigned: number;
  pct: number;
};

function buildExpenseAgg(
  txns: Transaction[],
  month: Date,
): {
  currency: string;
  expenseAbs: number;
  income: number;
  total: number;
  byCategory: CategoryAgg[];
} {
  const monthTxns = txns.filter((t) => inSameMonth(t.occurredAt, month));
  const currency = monthTxns[0]?.currency ?? "SGD";

  let expenseAbs = 0;
  let income = 0;
  let total = 0;

  const map = new Map<string, number>(); // category -> abs expense

  for (const t of monthTxns) {
    total += t.amount;
    if (t.amount < 0) {
      const abs = -t.amount;
      expenseAbs += abs;
      map.set(t.category, (map.get(t.category) ?? 0) + abs);
    } else {
      income += t.amount;
    }
  }

  const byCategory = Array.from(map.entries())
    .map(([category, amountAbs]) => ({
      category,
      amountAbs,
      amountSigned: -amountAbs,
      pct: expenseAbs > 0 ? amountAbs / expenseAbs : 0,
    }))
    .sort((a, b) => b.amountAbs - a.amountAbs);

  return { currency, expenseAbs, income, total, byCategory };
}

export default function AnalysisScreen(): React.ReactElement {
  const theme = useTheme();
  const [month, setMonth] = React.useState<Date>(() =>
    startOfMonth(new Date("2026-01-01T00:00:00+08:00")),
  );

  // optional: clear selection when changing month
  const clearSelected = useSetAtom(selectedCategoryAtom);

  const { currency, byCategory } = React.useMemo(
    () => buildExpenseAgg(SAMPLE, month),
    [month],
  );

  React.useEffect(() => {
    clearSelected(null);
  }, [month, clearSelected]);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
          backgroundColor: theme.colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* keep your own top bar + month nav + summary row here */}
      {/* e.g. Month: {monthTitle(month)} with prev/next */}

      <View style={{ height: theme.spacing.md }} />

      <ExpenseOverview
        theme={theme}
        currency={currency}
        byCategory={byCategory}
        formatMoney={formatMoney}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingTop: 8 },
});
