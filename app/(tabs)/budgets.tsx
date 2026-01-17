import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import type { MaterialTheme } from "@/constants/theme";
import type { CurrencyCode } from "@/types/money";

import { BudgetsHeader } from "@/components/budgets/header";
import { BudgetCategoryCard } from "@/components/budgets/categoryCard";
import { NotBudgetedRow } from "@/components/budgets/notBudgetRow";
import { BudgetEditorModal } from "@/components/budgets/editorModal";

import { useAtom, useSetAtom } from "jotai";
import {
  CategoriesAtom,
  TransactionsAtom,
  BudgetsAtom,
  UpsertBudgetAtom,
  DeleteBudgetAtom,
} from "@/contexts/init";

export type BudgetedCategory = {
  category: string;
  limit: number;
  spent: number; // positive number (abs spent)
  currency: CurrencyCode;
};

type EditorState =
  | { open: false }
  | {
      open: true;
      mode: "add" | "edit";
      category: string;
      monthLabel: string;
      initialLimit: number | null;
    };

export default function BudgetsScreen(): React.ReactElement {
  const theme = useTheme();

  const [categories] = useAtom(CategoriesAtom);
  const [txns] = useAtom(TransactionsAtom);
  const [allBudgets] = useAtom(BudgetsAtom);

  const upsertBudget = useSetAtom(UpsertBudgetAtom);
  const deleteBudget = useSetAtom(DeleteBudgetAtom);

  const [cursor, setCursor] = React.useState(() => startOfMonth(new Date()));
  const monthKey = monthKeyInt(cursor);

  // month time range [start, end)
  const { startMs, endMs } = React.useMemo(() => {
    const start = startOfMonth(cursor).getTime();
    const end = addMonths(cursor, 1).getTime();
    return { startMs: start, endMs: end };
  }, [cursor]);

  // sum abs(expenses) by category for this month
  const spentByCategory = React.useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of txns) {
      const ts = t.occurredAt.getTime();
      if (ts < startMs || ts >= endMs) continue;
      if (t.amount >= 0) continue; // only expenses
      m[t.category] = (m[t.category] ?? 0) + Math.abs(t.amount);
    }
    return m;
  }, [txns, startMs, endMs]);

  // budgets for this month
  const budgets = React.useMemo(() => {
    const monthBudgets = allBudgets.filter((b) => b.monthKey === monthKey);
    const currency: CurrencyCode = "SGD"; // pick your app default

    return monthBudgets.map(
      (b): BudgetedCategory => ({
        category: b.category,
        limit: b.amount,
        spent: spentByCategory[b.category] ?? 0,
        currency,
      }),
    );
  }, [allBudgets, monthKey, spentByCategory]);

  const budgetedCategorySet = React.useMemo(() => {
    return new Set(budgets.map((b) => b.category));
  }, [budgets]);

  const notBudgeted = React.useMemo(() => {
    return categories.filter((c) => !budgetedCategorySet.has(c.name));
  }, [categories, budgetedCategorySet]);

  const currency: CurrencyCode = budgets[0]?.currency ?? "SGD";

  const totalBudget = React.useMemo(
    () => budgets.reduce((acc, b) => acc + b.limit, 0),
    [budgets],
  );

  const totalSpent = React.useMemo(
    () => budgets.reduce((acc, b) => acc + b.spent, 0),
    [budgets],
  );

  const [editor, setEditor] = React.useState<EditorState>({ open: false });

  const openAddBudget = React.useCallback(
    (category: string) => {
      setEditor({
        open: true,
        mode: "add",
        category,
        monthLabel: monthLabel(cursor),
        initialLimit: null,
      });
    },
    [cursor],
  );

  const openEditBudget = React.useCallback(
    (category: string, existingLimit: number) => {
      setEditor({
        open: true,
        mode: "edit",
        category,
        monthLabel: monthLabel(cursor),
        initialLimit: existingLimit,
      });
    },
    [cursor],
  );

  const closeEditor = React.useCallback(() => setEditor({ open: false }), []);

  const removeBudget = React.useCallback(
    async (category: string) => {
      await deleteBudget({ category, monthKey });
    },
    [deleteBudget, monthKey],
  );

  const onBudgetMore = React.useCallback(
    (category: string, existingLimit: number) => {
      const actions = ["Edit", "Remove", "Cancel"];
      const cancelButtonIndex = 2;
      const destructiveButtonIndex = 1;

      const handle = (idx: number) => {
        if (idx === 0) openEditBudget(category, existingLimit);
        if (idx === 1) {
          Alert.alert(
            "Remove budget?",
            `Remove budget for "${category}" for ${monthLabel(cursor)}?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Remove",
                style: "destructive",
                onPress: () => {
                  void removeBudget(category);
                },
              },
            ],
          );
        }
      };

      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          { options: actions, cancelButtonIndex, destructiveButtonIndex },
          handle,
        );
      } else {
        Alert.alert(category, "Budget options", [
          { text: "Edit", onPress: () => handle(0) },
          { text: "Remove", style: "destructive", onPress: () => handle(1) },
          { text: "Cancel", style: "cancel" },
        ]);
      }
    },
    [cursor, openEditBudget, removeBudget],
  );

  const submitBudget = React.useCallback(
    async (payload: {
      category: string;
      monthLabel: string;
      limit: number;
    }) => {
      await upsertBudget({
        category: payload.category,
        monthKey,
        amount: payload.limit,
      });
      closeEditor();
    },
    [upsertBudget, monthKey, closeEditor],
  );

  return (
    <View style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: theme.spacing.xl + 84 },
        ]}
      >
        <View style={styles.centerWrap}>
          <BudgetsHeader
            theme={theme}
            monthLabel={monthLabel(cursor)}
            currency={currency}
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            onPrev={() => setCursor((d) => addMonths(d, -1))}
            onNext={() => setCursor((d) => addMonths(d, +1))}
          />

          <SectionTitle
            theme={theme}
            title={`Budgeted categories: ${shortMonthLabel(cursor)}`}
          />

          <View style={{ gap: theme.spacing.md }}>
            {budgets.map((b) => (
              <BudgetCategoryCard
                key={b.category}
                theme={theme}
                monthLabel={shortMonthLabel(cursor)}
                item={b}
                onMore={() => onBudgetMore(b.category, b.limit)}
                month={cursor}
              />
            ))}
          </View>

          <View style={{ height: theme.spacing.xl }} />

          <SectionTitle theme={theme} title="Not budgeted this month" />

          <View
            style={[
              styles.listCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.divider,
              },
            ]}
          >
            {notBudgeted.map((category, idx) => (
              <View key={category.name}>
                <NotBudgetedRow
                  theme={theme}
                  category={category.name}
                  onSetBudget={() => openAddBudget(category.name)}
                />
                {idx !== notBudgeted.length - 1 ? (
                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.colors.divider },
                    ]}
                  />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BudgetEditorModal
        theme={theme}
        visible={editor.open}
        title={
          editor.open
            ? editor.mode === "edit"
              ? "Edit budget"
              : "Set budget"
            : "Edit budget"
        }
        category={editor.open ? editor.category : ""}
        monthLabel={editor.open ? editor.monthLabel : ""}
        initialLimit={editor.open ? editor.initialLimit : null}
        onClose={closeEditor}
        onSubmit={submitBudget}
      />
    </View>
  );
}

function SectionTitle({
  theme,
  title,
}: {
  theme: MaterialTheme;
  title: string;
}): React.ReactElement {
  return (
    <View style={{ marginBottom: theme.spacing.sm }}>
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.onBackground, fontFamily: theme.fonts.rounded },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.sectionUnderline,
          { backgroundColor: theme.colors.divider },
        ]}
      />
    </View>
  );
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

// ✅ yyyymm
function monthKeyInt(d: Date): number {
  return d.getFullYear() * 100 + (d.getMonth() + 1);
}

function monthLabel(d: Date): string {
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function shortMonthLabel(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingTop: 10 },
  centerWrap: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 760,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  sectionUnderline: { height: 2, marginTop: 10, borderRadius: 999 },
  listCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  divider: { height: 1 },
});
