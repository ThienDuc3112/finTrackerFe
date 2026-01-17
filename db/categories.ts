import type { Category } from "@/types/money";
import type { OtherColorKey } from "@/constants/theme";
import { getDb } from "@/db/sqlite"; // your getDb()

type CategoryRow = {
  name: string;
  icon_name: string;
  color: string; // stores colorKey
};

export async function listCategories(): Promise<Category[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<CategoryRow>(
    `SELECT name, icon_name, color FROM categories ORDER BY name ASC`,
  );

  return rows.map((r) => ({
    name: r.name,
    iconName: r.icon_name as Category["iconName"],
    colorKey: r.color as OtherColorKey,
  }));
}

export async function upsertCategory(cat: Category): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO categories (name, icon_name, color)
     VALUES (?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET
       icon_name=excluded.icon_name,
       color=excluded.color`,
    cat.name,
    cat.iconName as unknown as string,
    cat.colorKey,
  );
}

export async function deleteCategory(name: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM categories WHERE name = ?`, name);
}
