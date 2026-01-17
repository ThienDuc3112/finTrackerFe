import React from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { btnStyle, btnTextStyle, cardStyle, makeStyles } from "../styles";

type Props = {
  theme: MaterialTheme;
  visible: boolean;

  title: string;

  initialName: string;
  initialPrice: number;

  // for Add item (optional)
  showQuantity?: boolean;
  initialQuantity?: number;

  onClose: () => void;
  onSave: (next: { name: string; price: number; quantity?: number }) => void;

  // for Edit item (optional)
  onRemove?: () => void;
};

export function ItemEditorSheet({
  theme,
  visible,
  title,
  initialName,
  initialPrice,
  showQuantity,
  initialQuantity,
  onClose,
  onSave,
  onRemove,
}: Props) {
  const s = makeStyles(theme);

  const [name, setName] = React.useState(initialName);
  const [priceText, setPriceText] = React.useState(String(initialPrice ?? ""));
  const [qtyText, setQtyText] = React.useState(String(initialQuantity ?? 1));

  React.useEffect(() => {
    if (!visible) return;
    setName(initialName ?? "");
    setPriceText(String(initialPrice ?? ""));
    setQtyText(String(initialQuantity ?? 1));
  }, [visible, initialName, initialPrice, initialQuantity]);

  const canSave = () => {
    const n = name.trim();
    if (!n) return false;

    const p = Number.parseFloat(priceText);
    if (!Number.isFinite(p) || p < 0) return false;

    if (showQuantity) {
      const q = Number.parseInt(qtyText, 10);
      if (!Number.isFinite(q) || q <= 0) return false;
    }
    return true;
  };

  const save = () => {
    const n = name.trim();
    const p = Number.parseFloat(priceText);
    const q = showQuantity ? Number.parseInt(qtyText, 10) : undefined;

    if (!canSave()) return;

    onSave({
      name: n,
      price: p,
      quantity: q,
    });
  };

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
            {title}
          </Text>

          <View style={{ gap: 8 }}>
            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: "700",
              }}
            >
              Item name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Eggs"
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
              Price (each)
            </Text>
            <TextInput
              value={priceText}
              onChangeText={setPriceText}
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

          {showQuantity ? (
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  color: theme.colors.onSurfaceVariant,
                  fontWeight: "700",
                }}
              >
                Quantity
              </Text>
              <TextInput
                value={qtyText}
                onChangeText={setQtyText}
                placeholder="1"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                keyboardType="number-pad"
                style={[
                  s.customInput,
                  {
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.divider,
                  },
                ]}
              />
            </View>
          ) : null}

          {onRemove ? (
            <Pressable
              onPress={onRemove}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                {
                  minHeight: 44,
                  borderRadius: theme.radius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.divider,
                  paddingHorizontal: theme.spacing.md,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                },
              ]}
            >
              <MaterialIcons
                name="delete-outline"
                size={18}
                color={theme.colors.error}
              />
              <Text style={{ color: theme.colors.error, fontWeight: "900" }}>
                Remove item
              </Text>
            </Pressable>
          ) : null}

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
              disabled={!canSave()}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                {
                  flex: 1,
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                },
                btnStyle(theme, "primary"),
                !canSave() && { opacity: 0.5 },
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
