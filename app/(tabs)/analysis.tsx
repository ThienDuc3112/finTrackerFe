import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import type { Transaction } from "@/types/money";

import { MonthNav } from "@/components/common/monthNav";
import { ExpenseOverview } from "@/components/analysis/overview";

// If you already have these in utils/money, use them instead
import { addMonths, monthTitle, formatMoneySGD } from "@/utils/money";
import { EmptyState } from "@/components/analysis/emptyState";

// OPTIONAL: if you use jotai for selected category highlight
import { useAtomValue, useSetAtom } from "jotai";
import { selectedCategoryAtom } from "@/components/analysis/state";
import { TransactionsAtom } from "@/contexts/init";

type CategoryAgg = {
  category: string;
  amountAbs: number; // positive absolute expense
  amountSigned: number; // negative for display if you prefer
  pct: number; // 0..1
};

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function buildExpenseByCategory(
  txns: Transaction[],
  month: Date,
): {
  byCategory: CategoryAgg[];
  expenseAbs: number;
  income: number;
  total: number;
} {
  const monthTxns = txns.filter((t) => isSameMonth(t.occurredAt, month));

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

  const byCategory: CategoryAgg[] = Array.from(map.entries())
    .map(([category, amountAbs]) => ({
      category,
      amountAbs,
      amountSigned: -amountAbs,
      pct: expenseAbs > 0 ? amountAbs / expenseAbs : 0,
    }))
    .sort((a, b) => b.amountAbs - a.amountAbs);

  return { byCategory, expenseAbs, income, total };
}

export default function AnalysisScreen(): React.ReactElement {
  const theme = useTheme();

  // Default to the latest month in SAMPLE (Jan 2026 in your data)
  const transactions = useAtomValue(TransactionsAtom);
  const [month, setMonth] = React.useState<Date>(new Date());

  // OPTIONAL (jotai): clear selected category when changing month
  const clearSelected = useSetAtom(selectedCategoryAtom);

  const { byCategory /*, expenseAbs, income, total */ } = React.useMemo(
    () => buildExpenseByCategory(transactions, month),
    [month, transactions],
  );

  return (
    <View style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <MonthNav
        theme={theme}
        label={monthTitle(month)}
        onPrev={() => {
          setMonth((m) => addMonths(m, -1));
          clearSelected(null);
        }}
        onNext={() => {
          setMonth((m) => addMonths(m, +1));
          clearSelected(null);
        }}
        onFilter={() => {
          // later: open a filter modal
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: theme.spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* If you already have a summary component from home, reuse it here */}
        {/* <Summary theme={theme} ... /> */}

        <View style={{ height: theme.spacing.lg }} />

        {byCategory.length == 0 ? (
          <EmptyState theme={theme} />
        ) : (
          <ExpenseOverview
            theme={theme}
            currency="SGD"
            byCategory={byCategory}
            formatMoney={(_currency, amount) => formatMoneySGD(amount)}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
});
