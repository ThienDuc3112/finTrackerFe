import React from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { btnStyle, btnTextStyle, cardStyle, makeStyles } from "../styles";

type PaymentOpt = { label: string; value: string };
const PAYMENT_OPTS: PaymentOpt[] = [
  { label: "Card", value: "CARD" },
  { label: "Cash", value: "CASH" },
  { label: "Transfer", value: "TRANSFER" },
];

type Props = {
  theme: MaterialTheme;
  visible: boolean;

  initialMerchant: string;
  initialPaymentMethod: string; // stored as "CARD" | "CASH" | "TRANSFER" (or any string)
  initialTotal: number;

  onClose: () => void;
  onSave: (next: {
    merchant: string;
    payment_method: string;
    total: number;
  }) => void;
};

export function MetadataEditorSheet({
  theme,
  visible,
  initialMerchant,
  initialPaymentMethod,
  initialTotal,
  onClose,
  onSave,
}: Props) {
  const s = makeStyles(theme);

  const [merchant, setMerchant] = React.useState(initialMerchant);
  const [payment, setPayment] = React.useState(initialPaymentMethod || "CARD");
  const [totalText, setTotalText] = React.useState(String(initialTotal ?? ""));

  React.useEffect(() => {
    if (!visible) return;
    setMerchant(initialMerchant ?? "");
    setPayment(initialPaymentMethod || "CARD");
    setTotalText(String(initialTotal ?? ""));
  }, [visible, initialMerchant, initialPaymentMethod, initialTotal]);

  const save = () => {
    const m = merchant.trim();
    if (!m) return;

    const t = Number.parseFloat(totalText);
    if (!Number.isFinite(t) || t < 0) return;

    onSave({
      merchant: m,
      payment_method: payment,
      total: t,
    });
  };

  const chip = (value: string) => {
    const selected = payment === value;
    return (
      <Pressable
        key={value}
        onPress={() => setPayment(value)}
        android_ripple={{ color: theme.colors.ripple }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: theme.radius.pill,
          borderWidth: 1,
          borderColor: selected ? theme.colors.primary : theme.colors.outline,
          backgroundColor: selected
            ? theme.colors.primaryContainer
            : "transparent",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        {selected ? (
          <MaterialIcons name="check" size={16} color={theme.colors.primary} />
        ) : null}
        <Text style={{ color: theme.colors.onSurface, fontWeight: "800" }}>
          {PAYMENT_OPTS.find((p) => p.value === value)?.label ?? value}
        </Text>
      </Pressable>
    );
  };

  const canSave =
    merchant.trim().length > 0 && Number.isFinite(Number.parseFloat(totalText));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={s.sheetBackdrop} onPress={onClose} />
      <View style={s.sheetWrap}>
        <View style={[s.sheet, cardStyle(theme)]}>
          <Text style={[s.sheetTitle, { color: theme.colors.onSurface }]}>
            Edit metadata
          </Text>

          <View style={{ gap: 8 }}>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: "700",
              }}
            >
              Merchant
            </Text>
            <TextInput
              value={merchant}
              onChangeText={setMerchant}
              placeholder="Merchant name"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              style={[
                s.customInput,
                {
                  color: theme.colors.onSurface,
                  borderColor: theme.colors.divider,
                },
              ]}
            />
          </View>

          <View style={{ gap: 8 }}>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: "700",
              }}
            >
              Payment type
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {PAYMENT_OPTS.map((p) => chip(p.value))}
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: "700",
              }}
            >
              Receipt total
            </Text>
            <TextInput
              value={totalText}
              onChangeText={setTotalText}
              placeholder="0.00"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              keyboardType="decimal-pad"
              style={[
                s.customInput,
                {
                  color: theme.colors.onSurface,
                  borderColor: theme.colors.divider,
                },
              ]}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: theme.spacing.sm,
            }}
          >
            <Pressable
              onPress={onClose}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                { flex: 1 },
                btnStyle(theme, "ghost"),
                {
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Text style={btnTextStyle(theme, "ghost")}>Cancel</Text>
            </Pressable>

            <Pressable
              onPress={save}
              disabled={!canSave}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                {
                  flex: 1,
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                },
                btnStyle(theme, "primary"),
                !canSave && { opacity: 0.5 },
              ]}
            >
              <Text style={btnTextStyle(theme, "primary")}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
