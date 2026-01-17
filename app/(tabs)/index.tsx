import React, { useCallback, useMemo, useState } from "react";
import {
  SectionList,
  StyleSheet,
  View,
  type SectionListData,
  type SectionListRenderItemInfo,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import type { MoneySummary, Transaction, TxnSection } from "@/types/money";
import { addMonths, formatMoneySGD, monthTitle } from "@/utils/money";

import { MonthNav } from "@/components/common/monthNav";
import { SummaryCard } from "@/components/homeScreen/summaryCard";
import { SectionHeader } from "@/components/homeScreen/sectionHeader";
import { TransactionRow } from "@/components/homeScreen/transactionRow";
import { Fab } from "@/components/homeScreen/fab";
import { TransactionSummaryModal } from "@/components/homeScreen/transactionSummaryModal";
import { EmptyState } from "@/components/analysis/emptyState";
import { useAtomValue, useSetAtom } from "jotai";
import { DeleteTransactionAtom, TransactionsAtom } from "@/contexts/init";

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function dateKey(d: Date): string {
  // Local date key (avoids UTC shifting from toISOString)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dateTitle(d: Date): string {
  const mon = d.toLocaleString("en-US", { month: "short" });
  const weekday = d.toLocaleString("en-US", { weekday: "long" });
  return `${mon} ${d.getDate()}, ${weekday}`;
}

function isSameMonth(a: Date, monthAnchor: Date): boolean {
  return (
    a.getFullYear() === monthAnchor.getFullYear() &&
    a.getMonth() === monthAnchor.getMonth()
  );
}

export default function RecordsScreen(): React.ReactElement {
  const theme = useTheme();
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const openTxn = useCallback((txn: Transaction) => setSelectedTxn(txn), []);
  const closeTxn = useCallback(() => setSelectedTxn(null), []);
  const [month, setMonth] = useState<Date>(() => new Date(2026, 0, 1));

  const transactions = useAtomValue(TransactionsAtom);
  const deleteTransaction = useSetAtom(DeleteTransactionAtom);

  const monthTxns = useMemo(() => {
    return transactions
      .filter((t) => isSameMonth(t.occurredAt, month))
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
  }, [month, transactions]);

  const sections = useMemo<TxnSection[]>(() => {
    const map = new Map<
      string,
      { date: Date; title: string; data: Transaction[] }
    >();

    for (const t of monthTxns) {
      const key = dateKey(t.occurredAt);
      const existing = map.get(key);
      if (existing) existing.data.push(t);
      else
        map.set(key, {
          date: t.occurredAt,
          title: dateTitle(t.occurredAt),
          data: [t],
        });
    }

    return Array.from(map.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(({ title, data }) => ({ title, data }));
  }, [monthTxns]);

  const summary = useMemo<MoneySummary>(() => {
    const expense = monthTxns
      .filter((t) => t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);

    const income = monthTxns
      .filter((t) => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);

    const total = income - expense;
    return { expense, income, total };
  }, [monthTxns]);

  const summaryItems = useMemo(() => {
    const totalText =
      (summary.total < 0 ? "-" : "") + formatMoneySGD(Math.abs(summary.total));

    return [
      {
        label: "EXPENSE",
        value: formatMoneySGD(summary.expense),
        valueColor: theme.colors.error,
      },
      {
        label: "INCOME",
        value: formatMoneySGD(summary.income),
        valueColor: theme.colors.success,
      },
      {
        label: "TOTAL",
        value: totalText,
        valueColor:
          summary.total < 0 ? theme.colors.error : theme.colors.success,
      },
    ] as const;
  }, [summary, theme.colors.error, theme.colors.success]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <MonthNav
        theme={theme}
        label={monthTitle(month)}
        onPrev={() => setMonth((m) => addMonths(m, -1))}
        onNext={() => setMonth((m) => addMonths(m, +1))}
      />

      <SummaryCard theme={theme} items={summaryItems} />

      <View
        style={{
          height: 1,
          backgroundColor: theme.colors.divider,
          marginTop: 12,
        }}
      />

      {monthTxns.length === 0 && <EmptyState theme={theme} />}
      <SectionList<Transaction, TxnSection>
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderSectionHeader={({
          section,
        }: {
          section: SectionListData<Transaction, TxnSection>;
        }) => <SectionHeader theme={theme} title={section.title} />}
        renderItem={(
          info: SectionListRenderItemInfo<Transaction, TxnSection>,
        ) => (
          <TransactionRow theme={theme} item={info.item} onPress={openTxn} />
        )}
      />

      <Fab theme={theme} bottom={24} />

      <TransactionSummaryModal
        theme={theme}
        visible={selectedTxn !== null}
        txn={selectedTxn}
        onClose={closeTxn}
        // TODO: optional later:
        onDelete={(t) => {
          deleteTransaction(t.id);
          closeTxn();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
});
