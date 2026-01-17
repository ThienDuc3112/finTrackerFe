export type PaymentMethod = "Card" | "Cash" | "Transfer";

export type Transaction = {
  id: string;
  date: Date;
  category: string;
  method: PaymentMethod;
  amount: number; // negative = expense
};

export type TxnSection = {
  title: string;
  data: Transaction[];
};

export type MoneySummary = {
  expense: number;
  income: number;
  total: number;
};
