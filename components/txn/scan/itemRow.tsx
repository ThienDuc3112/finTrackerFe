import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import type { LineState } from "./types";
import { makeStyles } from "./styles";
import { formatMoney } from "./utils";

type Props = {
  theme: MaterialTheme;
  currency: string;
  line: LineState;
  groupLabel: string;
  onToggle: () => void;
  onDec: () => void;
  onInc: () => void;
  onOpenMove: () => void;
};

export function ItemRow({
  theme,
  currency,
  line,
  groupLabel,
  onToggle,
  onDec,
  onInc,
  onOpenMove,
}: Props) {
  const s = makeStyles(theme);
  const checked = line.selected && line.qty > 0;

  return (
    <View
      style={[
        s.itemRow,
        {
          borderColor: theme.colors.divider,
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <Pressable
        onPress={onToggle}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={s.checkbox}
      >
        <MaterialIcons
          name={checked ? "check-box" : "check-box-outline-blank"}
          size={22}
          color={checked ? theme.colors.primary : theme.colors.outline}
        />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text
          style={{ color: theme.colors.onSurface, fontWeight: "800" }}
          numberOfLines={1}
        >
          {line.name}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>
            {formatMoney(currency, line.unitPrice)} ea
          </Text>

          <Pressable
            onPress={onOpenMove}
            android_ripple={{ color: theme.colors.ripple }}
            style={[
              s.groupChip,
              {
                borderColor: theme.colors.outline,
                backgroundColor: "transparent",
              },
            ]}
          >
            <MaterialIcons
              name="layers"
              size={14}
              color={theme.colors.onSurface}
            />
            <Text style={{ color: theme.colors.onSurface, fontSize: 12 }}>
              {groupLabel}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={s.qtyWrap}>
        <Pressable
          onPress={onDec}
          disabled={!checked}
          android_ripple={{ color: theme.colors.ripple, borderless: true }}
          style={s.qtyBtn}
        >
          <MaterialIcons
            name="remove"
            size={18}
            color={checked ? theme.colors.onSurface : theme.colors.outline}
          />
        </Pressable>

        <Text
          style={{
            color: theme.colors.onSurface,
            fontWeight: "900",
            width: 22,
            textAlign: "center",
          }}
        >
          {line.qty}
        </Text>

        <Pressable
          onPress={onInc}
          android_ripple={{ color: theme.colors.ripple, borderless: true }}
          style={s.qtyBtn}
        >
          <MaterialIcons name="add" size={18} color={theme.colors.onSurface} />
        </Pressable>

        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
          {formatMoney(currency, line.unitPrice * line.qty)}
        </Text>
      </View>
    </View>
  );
}
