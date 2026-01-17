import type { Transaction } from "@/types/money";
import { getDb } from "./sqlite";

type TxnRow = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  method: string;
  occurredAt: number; // epoch ms
  merchant: string | null;
  note: string | null;
  aiComment: string | null;
};

function rowToTxn(r: TxnRow): Transaction {
  return {
    id: r.id,
    amount: r.amount,
    currency: r.currency,
    category: r.category,
    method: r.method,
    occurredAt: new Date(r.occurredAt),
    merchant: r.merchant ?? undefined,
    note: r.note ?? undefined,
    aiComment: r.aiComment ?? undefined,
  };
}

export async function listTransactions(): Promise<Transaction[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<TxnRow>(`
    SELECT id, amount, currency, category, method, occurredAt, merchant, note, aiComment
    FROM transactions
    ORDER BY occurredAt DESC
  `);
  return rows.map(rowToTxn);
}

export async function upsertTransaction(txn: Transaction): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO transactions (id, amount, currency, category, method, occurredAt, merchant, note, aiComment)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       amount=excluded.amount,
       currency=excluded.currency,
       category=excluded.category,
       method=excluded.method,
       occurredAt=excluded.occurredAt,
       merchant=excluded.merchant,
       note=excluded.note,
       aiComment=excluded.aiComment
    `,
    txn.id,
    txn.amount,
    txn.currency,
    txn.category,
    txn.method,
    txn.occurredAt.getTime(),
    txn.merchant ?? "",
    txn.note ?? "",
    txn.aiComment ?? "",
  );
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM transactions WHERE id = ?`, id);
}
