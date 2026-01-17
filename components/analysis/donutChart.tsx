import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { MaterialTheme } from "@/constants/theme";

type Segment = {
  key: string; // category name
  value: number; // positive
  color: string;
  label: string;
};

type Props = {
  theme: MaterialTheme;
  size: number;
  strokeWidth: number;
  segments: Segment[];
  centerLabel?: string;

  selectedKey?: string | null;
  onSelect?: (key: string) => void;
};

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
) {
  const s = polarToCartesian(cx, cy, r, start);
  const e = polarToCartesian(cx, cy, r, end);
  const largeArcFlag = end - start > Math.PI ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${e.x} ${e.y}`;
}

export function DonutChart({
  theme,
  size,
  strokeWidth,
  segments,
  centerLabel = "",
  selectedKey = null,
  onSelect,
}: Props): React.ReactElement {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const baseR = (size - strokeWidth) / 2 - 5;
  const cx = size / 2;
  const cy = size / 2;

  // start at top
  let cursor = -Math.PI / 2;
  const gap = 0.03; // radians

  const inactiveOpacity = selectedKey ? 0.25 : 1;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {segments.map((s) => {
          if (total <= 0 || s.value <= 0) return null;

          const sweep = (s.value / total) * Math.PI * 2;
          const start = cursor + gap / 2;
          const end = cursor + sweep - gap / 2;
          cursor += sweep;

          if (end <= start) return null;

          const isSelected = !!selectedKey && s.key === selectedKey;
          const r = isSelected ? baseR + 2 : baseR;
          const sw = isSelected ? strokeWidth + 4 : strokeWidth;

          return (
            <Path
              key={s.key}
              d={arcPath(cx, cy, r, start, end)}
              stroke={s.color}
              strokeWidth={sw}
              strokeLinecap="butt"
              fill="none"
              opacity={isSelected ? 1 : inactiveOpacity}
              onPress={onSelect ? () => onSelect(s.key) : undefined}
            />
          );
        })}
      </Svg>

      <View style={styles.center}>
        <Text style={[styles.centerText, { color: theme.colors.onBackground }]}>
          {centerLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: { fontSize: 16, fontWeight: "800" },
});
