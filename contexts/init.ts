import { MaterialTheme } from "@/constants/theme";
import { SAMPLE } from "@/sampleData/transactions";
import { CategoryMeta, Transaction } from "@/types/money";
import { atom } from "jotai";

const CATEGORIES = [
  "Food",
  "Drinks",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Groceries",
  "Health",
  "Other",
] as const;

export const TransactionsAtom = atom<Transaction[]>(SAMPLE);
export const CategoriesAtom = atom<string[]>([...CATEGORIES]);

/**
 * Convenience write-only atom to add a category (dedupe + trim)
 * Usage: const [, addCategory] = useAtom(AddCategoryAtom); addCategory("New");
 */
export const AddCategoryAtom = atom(null, (get, set, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return;

  const prev = get(CategoriesAtom);
  if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return;

  set(CategoriesAtom, [...prev, trimmed]);
});

/**
 * Convenience write-only atom to replace categories from server.
 * Keeps defaults if server returns empty (optional behavior).
 */
export const SetCategoriesFromServerAtom = atom(
  null,
  (_get, set, categories: string[]) => {
    const cleaned = categories.map((c) => c.trim()).filter(Boolean);
    set(CategoriesAtom, cleaned.length ? cleaned : [...CATEGORIES]);
  },
);

export function categoryMeta(
  theme: MaterialTheme,
  category: string,
): CategoryMeta {
  // Same vibe as your screenshot: different colored round icons.
  switch (category) {
    case "Drinks":
      return { bg: theme.colors.error, iconName: "wine" };
    case "Shopping":
      return { bg: theme.colors.secondary, iconName: "cart" };
    case "Bills":
      return { bg: theme.colors.primary, iconName: "receipt" };
    case "Food":
      return { bg: theme.colors.error, iconName: "restaurant" };
    case "Transport":
      return { bg: theme.colors.secondary, iconName: "bus" };
    case "Entertainment":
      return { bg: theme.colors.primary, iconName: "film" };
    case "Groceries":
      return { bg: theme.colors.error, iconName: "cart" };
    case "Health":
      return { bg: theme.colors.secondary, iconName: "bandage" };

    default:
      return { bg: theme.colors.primaryContainer, iconName: "pricetag" };
  }
}
