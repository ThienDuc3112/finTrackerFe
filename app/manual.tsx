import React from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";

import { useTheme } from "@/hooks/use-theme";
import { makeStyles } from "@/components/txn/manual/styles";
import { safeNumber } from "@/components/txn/manual/utils";
import { router } from "expo-router";
import { TxnInput } from "@/types/money";
import { TopBar } from "@/components/txn/manual/topBar";
import { MethodCategoryRow } from "@/components/txn/manual/methodCategoryRow";
import { MerchantNoteInputs } from "@/components/txn/manual/merchantNoteInputs";
import { AmountKeypad } from "@/components/txn/manual/amountKeypad";

export default function ManualTxnPage(): React.ReactElement {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const form = useForm({
    defaultValues: {
      amount: 0,
      currency: "SGD",
      category: "Other",
      method: "Card",
      occurredAt: new Date(),
      merchant: "",
      note: "",
    } satisfies TxnInput,
    onSubmit: async ({ value }) => {
      if (!Number.isFinite(value.amount) || value.amount <= 0) {
        Alert.alert("Invalid amount", "Please enter an amount greater than 0.");
        return;
      }
      if (!value.currency) {
        Alert.alert("Missing currency", "Please select a currency.");
        return;
      }
      if (
        !(value.occurredAt instanceof Date) ||
        Number.isNaN(value.occurredAt.getTime())
      ) {
        Alert.alert("Invalid date", "Please set a valid date/time.");
        return;
      }

      const payload: TxnInput = {
        amount: safeNumber(value.amount),
        currency: value.currency || "SGD",
        category: value.category ?? "Other",
        method: value.method ?? "Card",
        occurredAt: value.occurredAt ?? new Date(),
        merchant: (value.merchant ?? "").trim(),
        note: value.note ?? "",
      };

      // TODO: call your API/store
      Alert.alert("TxnInput", JSON.stringify(payload, null, 2));
      router.back();
    },
  });

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
    >
      <TopBar theme={theme} form={form} />

      <View style={[styles.content, { paddingHorizontal: theme.spacing.lg }]}>
        <MethodCategoryRow theme={theme} form={form} />
        <MerchantNoteInputs theme={theme} form={form} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: theme.spacing.lg }}>
        <AmountKeypad theme={theme} form={form} />
      </View>
    </SafeAreaView>
  );
}
