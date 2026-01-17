import React from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "@tanstack/react-form";
import uuid from "react-native-uuid";
import { router, useLocalSearchParams } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";

import { useTheme } from "@/hooks/use-theme";
import { makeStyles } from "@/components/txn/manual/styles";
import { safeNumber } from "@/components/txn/manual/utils";
import { TxnInput } from "@/types/money";
import { TopBar } from "@/components/txn/manual/topBar";
import { MethodCategoryRow } from "@/components/txn/manual/methodCategoryRow";
import { MerchantNoteInputs } from "@/components/txn/manual/merchantNoteInputs";
import { AmountKeypad } from "@/components/txn/manual/amountKeypad";
import { UpsertTransactionAtom, TransactionsAtom } from "@/contexts/init";

const NEW_DEFAULTS: TxnInput = {
  amount: 0,
  currency: "SGD",
  category: "Other",
  method: "Card",
  occurredAt: new Date(),
  merchant: "",
  note: "",
};

export default function ManualTxnPage(): React.ReactElement {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const upsertTxn = useSetAtom(UpsertTransactionAtom);
  const txns = useAtomValue(TransactionsAtom);

  const params = useLocalSearchParams();
  const id = typeof params.id === "string" ? params.id : undefined;

  const editingTxn = React.useMemo(
    () => (id ? txns.find((t) => t.id === id) : undefined),
    [id, txns],
  );

  const form = useForm({
    defaultValues: NEW_DEFAULTS,
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

      const isEditing = Boolean(editingTxn);
      const idToUse = isEditing ? editingTxn!.id : (uuid.v4() as string);

      // preserve existing sign if editing; otherwise new manual = expense
      const signedAmount = isEditing
        ? editingTxn!.amount < 0
          ? -payload.amount
          : payload.amount
        : -payload.amount;

      await upsertTxn({
        id: idToUse,
        amount: signedAmount,
        category: payload.category ?? ("Other" as any),
        occurredAt: payload.occurredAt,
        note: payload.note,
        merchant: payload.merchant ?? "",
        currency: payload.currency,
        method: payload.method ?? "Card",
        aiComment: editingTxn?.aiComment ?? "",
      });

      router.back();
    },
  });

  React.useEffect(() => {
    if (id && !editingTxn) {
      Alert.alert("Not found", "This transaction no longer exists.");
      router.back();
      return;
    }

    if (!editingTxn) {
      form.reset(NEW_DEFAULTS);
      return;
    }

    form.reset({
      amount: Math.abs(editingTxn.amount),
      currency: editingTxn.currency ?? "SGD",
      category: editingTxn.category ?? "Other",
      method: editingTxn.method ?? "Card",
      occurredAt:
        editingTxn.occurredAt instanceof Date
          ? editingTxn.occurredAt
          : new Date(editingTxn.occurredAt as any),
      merchant: editingTxn.merchant ?? "",
      note: editingTxn.note ?? "",
    });
  }, [id, editingTxn?.id]); // <-- key deps

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
        <AmountKeypad
          theme={theme}
          form={form}
          seedAmount={editingTxn ? Math.abs(editingTxn.amount) : 0}
        />
      </View>
    </SafeAreaView>
  );
}
