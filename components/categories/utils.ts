import type { MaterialTheme, OtherColorKey } from "@/constants/theme";

export function isOtherColorKey(
  theme: MaterialTheme,
  key: string,
): key is OtherColorKey {
  return key in theme.colors.otherColors;
}

export function resolveCategoryColor(theme: MaterialTheme, colorKey: string) {
  if (isOtherColorKey(theme, colorKey))
    return theme.colors.otherColors[colorKey];
  return theme.colors.primary;
}

export function colorKeys(theme: MaterialTheme): OtherColorKey[] {
  return Object.keys(theme.colors.otherColors) as OtherColorKey[];
}
