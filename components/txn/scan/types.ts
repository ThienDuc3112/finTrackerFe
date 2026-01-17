export type ReceiptApiItem = {
  item: string;
  price: number;
  quantity: number;
  total: number;
};

export type ReceiptApiResponse = {
  merchant: string;
  payment_method: string; // e.g. "CARD"
  total: number;
  items: ReceiptApiItem[];
};

export type GroupState = {
  id: string;
  category: string | null;
};

export type LineState = {
  id: string;
  name: string;
  unitPrice: number;
  maxQty: number;
  qty: number;
  selected: boolean;
  groupId: string;
};

export const DEFAULT_CATEGORIES = [
  "Groceries",
  "Food",
  "Drinks",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
] as const;
