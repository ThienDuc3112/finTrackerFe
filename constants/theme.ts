/**
 * Catppuccin theme tokens (Latte light-ish / Macchiato dark) in a Material-ish shape.
 * Keeps legacy `Colors.light.text/background/tint/icon/tabIcon*` for Expo template compatibility.
 */
import { Platform } from "react-native";

export type AppColorScheme = "light" | "dark";

export type MaterialColors = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;

  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;

  background: string;
  onBackground: string;

  surface: string;
  onSurface: string;

  surfaceVariant: string;
  onSurfaceVariant: string;

  outline: string;
  divider: string;

  error: string;
  onError: string;

  success: string;
  onSuccess: string;

  ripple: string;
};

export type MaterialTheme = {
  scheme: AppColorScheme;
  colors: MaterialColors;
  radius: { sm: number; md: number; lg: number; xl: number; pill: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
  fonts: {
    sans: string;
    serif: string;
    rounded: string;
    mono: string;
  };
};

/**
 * Catppuccin Latte
 * Ref: https://catppuccin.com/palette
 */
const latte = {
  rosewater: "#dc8a78",
  flamingo: "#dd7878",
  pink: "#ea76cb",
  mauve: "#8839ef",
  red: "#d20f39",
  maroon: "#e64553",
  peach: "#fe640b",
  yellow: "#df8e1d",
  green: "#40a02b",
  teal: "#179299",
  sky: "#04a5e5",
  sapphire: "#209fb5",
  blue: "#1e66f5",
  lavender: "#7287fd",

  text: "#4c4f69",
  subtext1: "#5c5f77",
  subtext0: "#6c6f85",

  overlay2: "#7c7f93",
  overlay1: "#8c8fa1",
  overlay0: "#9ca0b0",

  surface2: "#acb0be",
  surface1: "#bcc0cc",
  surface0: "#ccd0da",

  base: "#eff1f5",
  mantle: "#e6e9ef",
  crust: "#dce0e8",
} as const;
/**
 * Catppuccin Macchiato
 */
const macchiato = {
  rosewater: "#f4dbd6",
  flamingo: "#f0c6c6",
  pink: "#f5bde6",
  mauve: "#c6a0f6",
  red: "#ed8796",
  maroon: "#ee99a0",
  peach: "#f5a97f",
  yellow: "#eed49f",
  green: "#a6da95",
  teal: "#8bd5ca",
  sky: "#91d7e3",
  sapphire: "#7dc4e4",
  blue: "#8aadf4",
  lavender: "#b7bdf8",

  text: "#cad3f5",
  subtext1: "#b8c0e0",
  subtext0: "#a5adcb",

  overlay2: "#939ab7",
  overlay1: "#8087a2",
  overlay0: "#6e738d",

  surface2: "#5b6078",
  surface1: "#494d64",
  surface0: "#363a4f",

  base: "#24273a",
  mantle: "#1e2030",
  crust: "#181926",
} as const;

/**
 * Mapping Catppuccin -> Material-ish tokens.
 * Primary: Mauve
 * Secondary: Blue
 * Error: Red
 * Success: Green
 */
const mdLight: MaterialColors = {
  primary: latte.mauve,
  onPrimary: latte.crust,
  primaryContainer: latte.lavender,
  onPrimaryContainer: latte.crust,

  secondary: latte.blue,
  onSecondary: latte.crust,
  secondaryContainer: latte.lavender,
  onSecondaryContainer: latte.crust,

  background: latte.base,
  onBackground: latte.text,

  surface: latte.mantle,
  onSurface: latte.text,

  surfaceVariant: latte.surface0,
  onSurfaceVariant: latte.subtext1,

  outline: latte.overlay0,
  divider: "rgba(198,208,245,0.12)",

  error: latte.red,
  onError: latte.crust,

  success: latte.green,
  onSuccess: latte.crust,

  ripple: "rgba(202,158,230,0.18)",
};

const mdDark: MaterialColors = {
  primary: macchiato.mauve,
  onPrimary: macchiato.crust,
  primaryContainer: macchiato.surface1,
  onPrimaryContainer: macchiato.text,

  secondary: macchiato.blue,
  onSecondary: macchiato.crust,
  secondaryContainer: macchiato.surface0,
  onSecondaryContainer: macchiato.text,

  background: macchiato.base,
  onBackground: macchiato.text,

  surface: macchiato.mantle,
  onSurface: macchiato.text,

  surfaceVariant: macchiato.surface0,
  onSurfaceVariant: macchiato.subtext1,

  outline: macchiato.overlay0,
  divider: "rgba(202,211,245,0.12)",

  error: macchiato.red,
  onError: macchiato.crust,

  success: macchiato.green,
  onSuccess: macchiato.crust,

  ripple: "rgba(198,160,246,0.18)",
};

export const Colors = {
  light: {
    // legacy template fields
    text: mdLight.onBackground,
    background: mdLight.background,
    tint: mdLight.primary,
    icon: mdLight.onSurfaceVariant,
    tabIconDefault: mdLight.onSurfaceVariant,
    tabIconSelected: mdLight.primary,
    // material tokens
    md: mdLight,
  },
  dark: {
    text: mdDark.onBackground,
    background: mdDark.background,
    tint: mdDark.primary,
    icon: mdDark.onSurfaceVariant,
    tabIconDefault: mdDark.onSurfaceVariant,
    tabIconSelected: mdDark.primary,
    md: mdDark,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
}) as {
  sans: string;
  serif: string;
  rounded: string;
  mono: string;
};

export const getMaterialTheme = (scheme: AppColorScheme): MaterialTheme => {
  return {
    scheme,
    colors: Colors[scheme].md,
    radius: { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 },
    spacing: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
    fonts: Fonts,
  };
};
