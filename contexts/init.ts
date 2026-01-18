import type { Budget } from "@/db/budgets";
import { listBudgets, upsertBudget, deleteBudget } from "@/db/budgets";
import type { MaterialTheme, OtherColorKey } from "@/constants/theme";
import type { Category, Transaction } from "@/types/money";
import { Ionicons } from "@expo/vector-icons";
import { atom } from "jotai";
import type { ComponentProps } from "react";

import { initDb } from "@/db/sqlite";
import {
  listCategories,
  upsertCategory,
  deleteCategory,
} from "@/db/categories";
import {
  listTransactions,
  upsertTransaction,
  deleteTransaction,
} from "@/db/transactions";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type CategoryDef = {
  name: string;
  iconName: IoniconName;
  colorKey: OtherColorKey;
};

export const DEFAULT_CATEGORIES: CategoryDef[] = [
  { name: "Drinks", iconName: "wine", colorKey: "peach" },
  { name: "Shopping", iconName: "cart", colorKey: "lavender" },
  { name: "Bills", iconName: "receipt", colorKey: "sapphire" },
  { name: "Food", iconName: "restaurant", colorKey: "red" },
  { name: "Transport", iconName: "bus", colorKey: "blue" },
  { name: "Entertainment", iconName: "film", colorKey: "mauve" },
  { name: "Groceries", iconName: "cart", colorKey: "green" },
  { name: "Health", iconName: "bandage", colorKey: "teal" },
  { name: "Other", iconName: "pricetag", colorKey: "sky" },
];

export const TransactionsAtom = atom<Transaction[]>([]);
export const CategoriesAtom = atom<Category[]>([]);

export const BootstrapAtom = atom(null, async (_get, set) => {
  await initDb();
  const [cats, txns, budgets] = await Promise.all([
    listCategories(),
    listTransactions(),
    listBudgets(),
  ]);
  set(CategoriesAtom, cats);
  set(TransactionsAtom, txns);
  set(BudgetsAtom, budgets);
});

export const RefreshCategoriesAtom = atom(null, async (_get, set) => {
  set(CategoriesAtom, await listCategories());
});
export const RefreshTransactionsAtom = atom(null, async (_get, set) => {
  set(TransactionsAtom, await listTransactions());
});

export const UpsertCategoryAtom = atom(
  null,
  async (_get, set, cat: Category) => {
    await upsertCategory(cat);
    set(CategoriesAtom, (prev) => {
      const next = prev.filter((c) => c.name !== cat.name);
      next.push(cat);
      next.sort((a, b) => a.name.localeCompare(b.name));
      return next;
    });
  },
);

export const DeleteCategoryAtom = atom(
  null,
  async (_get, set, name: string) => {
    await deleteCategory(name);
    set(CategoriesAtom, (prev) => prev.filter((c) => c.name !== name));
    // transactions are FK-cascaded; you can refresh txns if you want
    // set(TransactionsAtom, await listTransactions());
  },
);

export const UpsertTransactionAtom = atom(
  null,
  async (get, set, txn: Transaction) => {
    await upsertTransaction(txn);

    set(TransactionsAtom, (prev) => {
      const without = prev.filter((t) => t.id !== txn.id);
      const ts = txn.occurredAt.getTime();
      const idx = without.findIndex((t) => t.occurredAt.getTime() < ts);
      if (idx === -1) return [...without, txn];
      return [...without.slice(0, idx), txn, ...without.slice(idx)];
    });

    if (!get(RudeRemarkEnabledAtom)) return;

    set(RudeRemarkGateAtom, { visible: true, phase: "loading", txnId: txn.id });

    let remark = "";
    try {
      remark = await fetchRudeRemark(txn);
    } catch {
      remark = "Remark server is down. You're spared… temporarily.";
    }

    // show remark for 5s (forced)
    set(RudeRemarkGateAtom, {
      visible: true,
      phase: "showing",
      txnId: txn.id,
      remark,
      lockUntil: Date.now() + 5000,
    });
  },
);

export const DeleteTransactionAtom = atom(
  null,
  async (_get, set, id: string) => {
    await deleteTransaction(id);
    set(TransactionsAtom, (prev) => prev.filter((t) => t.id !== id));
  },
);

export function resolveCategoryColor(
  theme: MaterialTheme,
  colorKey: OtherColorKey,
): string {
  return theme.colors.otherColors[colorKey];
}

export function categoryMeta(theme: MaterialTheme, categoryName: string) {
  const hit =
    DEFAULT_CATEGORIES.find((c) => c.name === categoryName) ??
    DEFAULT_CATEGORIES.find((c) => c.name === "Other") ??
    DEFAULT_CATEGORIES[0];

  return {
    color: resolveCategoryColor(theme, hit.colorKey),
    iconName: hit.iconName,
  };
}

export const BudgetsAtom = atom<Budget[]>([]);

export const RefreshBudgetsAtom = atom(null, async (_get, set) => {
  set(BudgetsAtom, await listBudgets());
});

export const UpsertBudgetAtom = atom(
  null,
  async (
    _get,
    set,
    input: { category: string; monthKey: number; amount: number },
  ) => {
    const saved = await upsertBudget(input);

    set(BudgetsAtom, (prev) => {
      const next = prev.filter(
        (b) =>
          !(b.category === saved.category && b.monthKey === saved.monthKey),
      );
      next.push(saved);
      next.sort(
        (a, b) =>
          b.monthKey - a.monthKey || a.category.localeCompare(b.category),
      );
      return next;
    });
  },
);

export const DeleteBudgetAtom = atom(
  null,
  async (_get, set, input: { category: string; monthKey: number }) => {
    await deleteBudget(input);
    set(BudgetsAtom, (prev) =>
      prev.filter(
        (b) =>
          !(b.category === input.category && b.monthKey === input.monthKey),
      ),
    );
  },
);

// 1) feature toggle atom (default ON for maximum annoyance)
export const RudeRemarkEnabledAtom = atom<boolean>(true);

export type RudeRemarkGateState =
  | { visible: false }
  | { visible: true; phase: "loading"; txnId: string }
  | {
      visible: true;
      phase: "showing";
      txnId: string;
      remark: string;
      lockUntil: number; // epoch ms
    };

// 2) global gate state
export const RudeRemarkGateAtom = atom<RudeRemarkGateState>({ visible: false });

// 3) call your backend to generate the rude remark
async function fetchRudeRemark(txn: Transaction): Promise<string> {
  const payload = {
    id: txn.id,
    amount: txn.amount,
    currency: txn.currency,
    category: txn.category,
    method: txn.method,
    occurredAt: txn.occurredAt.toISOString(),
    merchant: txn.merchant ?? "",
    note: txn.note ?? "",
  };

  const res = await fetch(
    "https://finaunty-python.onrender.com/insert-transactions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([payload]),
    },
  );

  if (!res.ok) throw new Error(`rude-remark api failed: ${res.status}`);

  const data = (await res.json()) as [{ aiComment?: string }];
  const remark = data?.[0].aiComment?.trim();
  return remark && remark.length ? remark : "No remark. Somehow that's worse.";
}
