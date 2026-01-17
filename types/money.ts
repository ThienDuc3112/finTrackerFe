export type PaymentMethod = "Card" | "Cash" | "Transfer";

export type TxnSection = {
  title: string;
  data: Transaction[];
};

export type MoneySummary = {
  expense: number;
  income: number;
  total: number;
};

export type CurrencyCode = "SGD" | (string & {});

export type Transaction = {
  id: string;
  amount: number;
  currency: CurrencyCode;
  category: string;
  method: string;
  occurredAt: Date;
  merchant?: string;
  note?: string;
  aiComment?: string;
};

type TxnInput = {
  amount: number;
  currency: string;
  category?: string | null | undefined;
  method?: string | null | undefined;
  occurredAt: Date;
  merchant?: string | null | undefined;
  note: string;
};
