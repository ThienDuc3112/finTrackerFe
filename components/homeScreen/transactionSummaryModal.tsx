import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { MaterialTheme } from "@/constants/theme";
import type { Transaction } from "@/types/money";
import { categoryMeta } from "@/contexts/init";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  theme: MaterialTheme;
  visible: boolean;
  txn: Transaction | null;
  onClose: () => void;
  onEdit?: (txn: Transaction) => void;
  onDelete?: (txn: Transaction) => void;
};

const methodIcon = (method: string): IoniconName => {
  switch (method) {
    case "Cash":
      return "cash-outline";
    case "Transfer":
      return "swap-horizontal-outline";
    case "Card":
    default:
      return "card-outline";
  }
};

const formatMoney = (txn: Transaction) => {
  const sign = txn.amount < 0 ? "-" : "";
  const abs = Math.abs(txn.amount).toFixed(2);
  const prefix = txn.currency === "SGD" ? "S$" : `${txn.currency} `;
  return `${sign}${prefix}${abs}`;
};

const formatOccurredAt = (d: Date) => {
  if (Number.isNaN(d.getTime())) return "Invalid date";
  // Matches your screenshot-ish: "Jan 17, 2026 12:17 PM"
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export function TransactionSummaryModal({
  theme,
  visible,
  txn,
  onClose,
  onEdit,
  onDelete,
}: Props): React.ReactElement | null {
  if (!txn) return null;

  const isExpense = txn.amount < 0;
  const headerBg = isExpense ? theme.colors.error : theme.colors.success;
  const headerFg = isExpense ? theme.colors.onError : theme.colors.onSuccess;

  const cat = categoryMeta(theme, txn.category);
  const noteText = txn.note?.trim() || txn.merchant?.trim() || "No notes";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
            },
          ]}
          // prevents taps inside the card from closing the modal
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                backgroundColor: headerBg,
                borderTopLeftRadius: theme.radius.lg,
                borderTopRightRadius: theme.radius.lg,
                paddingHorizontal: theme.spacing.md,
                paddingTop: theme.spacing.md,
                paddingBottom: theme.spacing.sm,
              },
            ]}
          >
            <View style={styles.headerTopRow}>
              <Pressable onPress={onClose} hitSlop={12} style={styles.iconBtn}>
                <Ionicons name="close" size={22} color={headerFg} />
              </Pressable>

              <Text style={[styles.headerTitle, { color: headerFg }]}>
                {isExpense ? "EXPENSE" : "INCOME"}
              </Text>

              <View style={styles.headerRight}>
                {onDelete ? (
                  <Pressable
                    onPress={() => onDelete(txn)}
                    hitSlop={12}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={headerFg} />
                  </Pressable>
                ) : null}

                {onEdit ? (
                  <Pressable
                    onPress={() => onEdit(txn)}
                    hitSlop={12}
                    style={[styles.iconBtn, { marginLeft: 10 }]}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={headerFg}
                    />
                  </Pressable>
                ) : null}
              </View>
            </View>

            <Text style={[styles.amount, { color: headerFg }]}>
              {formatMoney(txn)}
            </Text>

            <Text style={[styles.date, { color: headerFg }]}>
              {formatOccurredAt(txn.occurredAt)}
            </Text>
          </View>

          {/* Body */}
          <View
            style={[
              styles.body,
              {
                paddingHorizontal: theme.spacing.xl,
                paddingVertical: theme.spacing.lg,
              },
            ]}
          >
            <View style={styles.line}>
              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                Account
              </Text>

              <View
                style={[
                  styles.chip,
                  {
                    borderRadius: theme.radius.md,
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.surfaceVariant,
                  },
                ]}
              >
                <View
                  style={[
                    styles.chipIconBox,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.outline,
                      borderRadius: theme.radius.sm,
                    },
                  ]}
                >
                  <Ionicons
                    name={methodIcon(txn.method)}
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                </View>

                <Text
                  style={[
                    styles.chipText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {txn.method}
                </Text>
              </View>
            </View>

            <View style={[styles.line, { marginTop: theme.spacing.md }]}>
              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                Category
              </Text>

              <View
                style={[
                  styles.chip,
                  {
                    borderRadius: theme.radius.md,
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.surfaceVariant,
                  },
                ]}
              >
                <View
                  style={[
                    styles.chipIconBox,
                    {
                      backgroundColor: cat.color,
                      borderColor: theme.colors.outline,
                      borderRadius: theme.radius.sm,
                    },
                  ]}
                >
                  <Ionicons name={cat.iconName} size={18} color="#fff" />
                </View>

                <Text
                  style={[
                    styles.chipText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {txn.category}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.note,
                {
                  color: theme.colors.onSurfaceVariant,
                  marginTop: theme.spacing.lg,
                },
              ]}
            >
              {noteText}
            </Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    overflow: "hidden",
  },
  header: {},
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 2,
  },
  amount: {
    fontSize: 44,
    fontWeight: "900",
    marginTop: 8,
  },
  date: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    opacity: 0.95,
  },
  body: {},
  line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 22,
    fontWeight: "800",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipIconBox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  chipText: {
    fontSize: 18,
    fontWeight: "800",
  },
  note: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    opacity: 0.9,
  },
});
