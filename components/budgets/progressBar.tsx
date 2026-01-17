import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  pct: number; // 0..1
  isOver?: boolean;
  rightTag: string;
};

export function BudgetProgressBar({
  theme,
  pct,
  isOver,
  rightTag,
}: Props): React.ReactElement {
  const fillPct = Math.max(0, Math.min(pct, 1));

  return (
    <View style={{ marginTop: 12 }}>
      <View
        style={[
          styles.track,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: theme.colors.outline,
            borderRadius: theme.radius.pill,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${fillPct * 100}%`,
              backgroundColor: isOver
                ? theme.colors.error
                : theme.colors.success,
              borderRadius: theme.radius.pill,
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.tag,
          {
            backgroundColor: isOver ? theme.colors.error : theme.colors.success,
            borderRadius: theme.radius.sm,
          },
        ]}
      >
        <Text
          style={[
            styles.tagText,
            { color: isOver ? theme.colors.onError : theme.colors.onSuccess },
          ]}
        >
          {rightTag}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  fill: { height: "100%" },
  tag: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 8,
  },
  tagText: { fontSize: 13, fontWeight: "800" },
});
