import { getDb } from "@/db/sqlite";

export type Budget = {
  id: string;
  category: string;
  monthKey: number; // yyyymm
  amount: number;
};

type BudgetRow = {
  id: string;
  category: string;
  month_key: number;
  amount: number;
};

export async function listBudgets(): Promise<Budget[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<BudgetRow>(`
    SELECT id, category, month_key, amount
    FROM budgets
    ORDER BY month_key DESC, category ASC
  `);

  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    monthKey: r.month_key,
    amount: r.amount,
  }));
}

export async function upsertBudget(input: {
  category: string;
  monthKey: number;
  amount: number;
}): Promise<Budget> {
  const db = await getDb();

  // deterministic id so repeated upserts are stable
  const id = `${input.monthKey}:${input.category}`;

  await db.runAsync(
    `INSERT INTO budgets (id, category, month_key, amount)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(category, month_key) DO UPDATE SET
       amount=excluded.amount`,
    id,
    input.category,
    input.monthKey,
    input.amount,
  );

  return {
    id,
    category: input.category,
    monthKey: input.monthKey,
    amount: input.amount,
  };
}

export async function deleteBudget(input: {
  category: string;
  monthKey: number;
}): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `DELETE FROM budgets WHERE category = ? AND month_key = ?`,
    input.category,
    input.monthKey,
  );
}
