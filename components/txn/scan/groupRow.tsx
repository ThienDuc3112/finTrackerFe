import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import type { GroupState } from "./types";
import { makeStyles } from "./styles";
import { formatMoney } from "./utils";

type Props = {
  theme: MaterialTheme;
  currency: string;
  group: GroupState;
  index: number;
  total: number;
  canDelete: boolean;
  onPickCategory: () => void;
  onDelete: () => void;
};

export function GroupRow({
  theme,
  currency,
  group,
  index,
  total,
  canDelete,
  onPickCategory,
  onDelete,
}: Props) {
  const s = makeStyles(theme);

  return (
    <View
      style={[
        s.groupRow,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.divider,
        },
      ]}
    >
      <Pressable
        onPress={onPickCategory}
        android_ripple={{ color: theme.colors.ripple }}
        style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 12 }}
      >
        <Text style={{ color: theme.colors.onSurface, fontWeight: "900" }}>
          Group {index + 1}
        </Text>
        <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
          Category: {group.category ?? "Pick category…"} • Total:{" "}
          {formatMoney(currency, total)}
        </Text>
      </Pressable>

      <Pressable
        onPress={onDelete}
        android_ripple={{ color: theme.colors.ripple }}
        style={s.trashBtn}
        disabled={!canDelete}
      >
        <MaterialIcons
          name="delete-outline"
          size={20}
          color={!canDelete ? theme.colors.outline : theme.colors.error}
        />
      </Pressable>
    </View>
  );
}
