import { OtherColorKey } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

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

export type TxnInput = {
  amount: number;
  currency: string;
  category?: string | null | undefined;
  method?: string | null | undefined;
  occurredAt: Date;
  merchant?: string | null | undefined;
  note: string;
};

export const CURRENCIES = ["SGD", "USD", "MYR"] as const;
export const METHODS = ["Card", "Cash", "Transfer"] as const;

export type Currency = (typeof CURRENCIES)[number];
export type Method = (typeof METHODS)[number];

type IoniconName = ComponentProps<typeof Ionicons>["name"];
export type Category = {
  name: string;
  colorKey: OtherColorKey;
  iconName: IoniconName;
};
