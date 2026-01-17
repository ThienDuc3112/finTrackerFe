import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useAtom } from "jotai";
import type { MaterialTheme } from "@/constants/theme";

import { selectedCategoryAtom } from "@/components/analysis/state";
import { DonutChart } from "@/components/analysis/donutChart";
import { CategoryRow } from "@/components/analysis/categoryRow";

type CategoryAgg = {
  category: string;
  amountAbs: number;
  amountSigned: number;
  pct: number;
};

type Props = {
  theme: MaterialTheme;
  currency: string;
  byCategory: CategoryAgg[];
  formatMoney: (currency: string, amount: number) => string;
};

function categoryColor(theme: MaterialTheme, idx: number): string {
  const palette = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.error,
    theme.colors.success,
    theme.colors.primaryContainer,
    theme.colors.secondaryContainer,
  ];
  return palette[idx % palette.length];
}

export function ExpenseOverview({
  theme,
  currency,
  byCategory,
  formatMoney,
}: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const isWide = width >= 600; // foldable unfolded usually > 600, tweak if needed

  const [selected, setSelected] = useAtom(selectedCategoryAtom);

  const onSelect = React.useCallback(
    (cat: string) => setSelected((prev) => (prev === cat ? null : cat)),
    [setSelected],
  );

  const segments = React.useMemo(
    () =>
      byCategory.map((c, idx) => ({
        key: c.category,
        value: c.amountAbs,
        color: categoryColor(theme, idx),
        label: c.category,
      })),
    [byCategory, theme],
  );

  const [chartW, setChartW] = React.useState(0);

  // keep donut nicely sized inside its column
  const donutSize = Math.max(140, Math.min(chartW, 240)); // tweak bounds to taste

  const legendMax = 200; // <-- “text decides width” up to this max

  return (
    <View>
      {/* static header (not a dropdown) */}
      <View
        style={[
          styles.sectionHeader,
          {
            borderColor: theme.colors.primary,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          EXPENSE OVERVIEW
        </Text>
      </View>

      <View style={{ height: theme.spacing.md }} />

      <View style={styles.chartRow}>
        <View
          style={[
            styles.chartCol,
            isWide && {
              alignItems: "flex-end",
              paddingRight: theme.spacing.sm,
            },
          ]}
          onLayout={(e) => setChartW(e.nativeEvent.layout.width)}
        >
          {chartW > 0 ? (
            <DonutChart
              theme={theme}
              size={donutSize}
              strokeWidth={26}
              centerLabel="Expenses"
              segments={segments}
              selectedKey={selected}
              onSelect={onSelect}
            />
          ) : null}
        </View>

        <View
          style={{
            flexShrink: 0,
            paddingLeft: isWide ? theme.spacing.md : theme.spacing.lg, // ✅ tighter on wide
            maxWidth: legendMax,
          }}
        >
          {segments.map((s) => {
            const isSelected = selected === s.key;
            const dim = selected && !isSelected;

            return (
              <Pressable
                key={s.key}
                onPress={() => onSelect(s.key)}
                android_ripple={{ color: theme.colors.ripple }}
                style={styles.legendRow}
              >
                <View
                  style={[
                    styles.legendSwatch,
                    {
                      backgroundColor: s.color,
                      borderRadius: theme.radius.sm,
                      opacity: dim ? 0.3 : 1,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.legendText,
                    { color: theme.colors.onBackground },
                    dim && { opacity: 0.35 },
                    isSelected && { fontWeight: "900" },
                  ]}
                  numberOfLines={1}
                >
                  {s.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ height: theme.spacing.lg }} />

      <View
        style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.colors.divider,
        }}
      />

      {byCategory.map((c, idx) => (
        <CategoryRow
          key={c.category}
          theme={theme}
          category={c.category}
          amountText={formatMoney(currency, c.amountSigned)}
          pct={c.pct}
          color={categoryColor(theme, idx)}
          selected={selected === c.category}
          onPress={() => onSelect(c.category)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", letterSpacing: 0.8 },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  legendSwatch: { width: 14, height: 14 },
  legendText: { fontSize: 14, fontWeight: "700" },
  chartCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
