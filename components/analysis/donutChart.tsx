import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { MaterialTheme } from "@/constants/theme";

type Segment = {
  key: string;
  value: number;
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

/**
 * Filled donut-sector path (outer arc + inner arc) for reliable touch hitbox on Android.
 */
function sectorPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  start: number,
  end: number,
) {
  const largeArcFlag = end - start > Math.PI ? 1 : 0;

  const os = polarToCartesian(cx, cy, rOuter, start);
  const oe = polarToCartesian(cx, cy, rOuter, end);
  const ie = polarToCartesian(cx, cy, rInner, end);
  const is = polarToCartesian(cx, cy, rInner, start);

  return [
    `M ${os.x} ${os.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    // reverse sweep on inner arc
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${is.x} ${is.y}`,
    "Z",
  ].join(" ");
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
  const gap = 0.03;

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

          // define inner/outer radii to match the visible stroke thickness
          const rOuter = r + sw / 2;
          const rInner = Math.max(1, r - sw / 2);

          const handlePress = onSelect ? () => onSelect(s.key) : undefined;

          return (
            <React.Fragment key={s.key}>
              {/* ✅ Android-friendly hit area */}
              <Path
                d={sectorPath(cx, cy, rOuter, rInner, start, end)}
                fill={theme.colors.background}
                fillOpacity={0.01} // effectively invisible but still hittable on Android
                onPressIn={handlePress} // onPressIn tends to be more reliable in ScrollView
              />

              {/* visible stroke */}
              <Path
                d={arcPath(cx, cy, r, start, end)}
                stroke={s.color}
                strokeWidth={sw}
                strokeLinecap="butt"
                fill="none"
                opacity={isSelected ? 1 : inactiveOpacity}
                // optional: keep this too; harmless
                onPressIn={handlePress}
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {/* keep label, and make sure it doesn't eat touches */}

      <View pointerEvents="none" style={styles.center}>
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
