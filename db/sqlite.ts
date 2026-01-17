import { Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";
import type { SQLiteDatabase } from "expo-sqlite";
import { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type Category = {
  name: string;
  iconName: IoniconName;
  color: string; // hex string, etc
};

const DEFAULT_CATEGORIES: Category[] = [
  { name: "Food", iconName: "restaurant", color: "#E78284" },
  { name: "Drinks", iconName: "cafe", color: "#EA999C" },
  { name: "Transport", iconName: "bus", color: "#8AADF4" },
  { name: "Shopping", iconName: "bag", color: "#F5A97F" },
  { name: "Bills", iconName: "receipt", color: "#A6DA95" },
  { name: "Salary", iconName: "cash", color: "#A6DA95" },
  { name: "Other", iconName: "apps", color: "#CAD3F5" },
];

let dbPromise: Promise<SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("spendy.db");
  return dbPromise;
}

async function seedCategoriesIfEmpty(db: SQLiteDatabase, cats: Category[]) {
  const row = await db.getFirstAsync<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM categories`,
  );
  if ((row?.cnt ?? 0) > 0) return;

  await db.withTransactionAsync(async () => {
    for (const c of cats) {
      await db.runAsync(
        `INSERT INTO categories (name, icon_name, color) VALUES (?, ?, ?)`,
        c.name,
        c.iconName,
        c.color,
      );
    }
  });
}

export async function initDb(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      name TEXT PRIMARY KEY NOT NULL,
      icon_name TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL,
      category TEXT NOT NULL REFERENCES categories(name)
        ON DELETE CASCADE ON UPDATE CASCADE,
      method TEXT NOT NULL,
      occurredAt INTEGER NOT NULL,
      merchant TEXT NOT NULL,
      note TEXT NOT NULL,
      aiComment TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_txn_occurredAt
      ON transactions (occurredAt DESC);

    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY NOT NULL,
      category TEXT NOT NULL REFERENCES categories(name)
        ON DELETE CASCADE ON UPDATE CASCADE,
      month_key INTEGER NOT NULL,
      amount REAL NOT NULL CHECK (amount >= 0),

      UNIQUE(category, month_key)
    );

    CREATE INDEX IF NOT EXISTS idx_budgets_month
      ON budgets (month_key);

    CREATE INDEX IF NOT EXISTS idx_budgets_category
      ON budgets (category);
  `);

  await seedCategoriesIfEmpty(db, DEFAULT_CATEGORIES);
}
