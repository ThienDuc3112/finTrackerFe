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

import { useAtom } from "jotai";
import { CategoriesAtom } from "@/contexts/init";

export type BudgetedCategory = {
  category: string;
  limit: number;
  spent: number; // positive number (abs spent)
  currency: CurrencyCode;
};

type BudgetMonthStore = Record<string, BudgetedCategory[]>;

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

  const [cursor, setCursor] = React.useState(() => startOfMonth(new Date()));
  const key = monthKey(cursor);

  // Store budgets by month key so navbar month change swaps the list
  const [budgetsByMonth, setBudgetsByMonth] = React.useState<BudgetMonthStore>(
    () => ({
      // sample month data: current month gets your demo budgets
      [monthKey(startOfMonth(new Date()))]: [
        { category: "Drinks", limit: 100, spent: 35.2, currency: "SGD" },
        { category: "Shopping", limit: 200, spent: 96.54, currency: "SGD" },
      ],
    }),
  );

  const budgets = budgetsByMonth[key] ?? [];

  const budgetedCategorySet = React.useMemo(() => {
    return new Set(budgets.map((b) => b.category));
  }, [budgets]);

  const notBudgeted = React.useMemo(() => {
    return categories.filter((c) => !budgetedCategorySet.has(c));
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
    (category: string) => {
      setBudgetsByMonth((prev) => {
        const list = prev[key] ?? [];
        const nextList = list.filter((b) => b.category !== category);
        return { ...prev, [key]: nextList };
      });
    },
    [key],
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
                onPress: () => removeBudget(category),
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
    (payload: { category: string; monthLabel: string; limit: number }) => {
      setBudgetsByMonth((prev) => {
        const list = prev[key] ?? [];
        const exists = list.find((b) => b.category === payload.category);

        const nextList = exists
          ? list.map((b) =>
              b.category === payload.category
                ? { ...b, limit: payload.limit }
                : b,
            )
          : [
              ...list,
              {
                category: payload.category,
                limit: payload.limit,
                spent: 0,
                currency: "SGD",
              } satisfies BudgetedCategory,
            ];

        return { ...prev, [key]: nextList };
      });

      closeEditor();
    },
    [key, closeEditor],
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
              <View key={category}>
                <NotBudgetedRow
                  theme={theme}
                  category={category}
                  onSetBudget={() => openAddBudget(category)}
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

function monthKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
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
