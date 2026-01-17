import { StyleSheet } from "react-native";
import type { MaterialTheme } from "@/constants/theme";

export function cardStyle(theme: MaterialTheme) {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  } as const;
}

export function btnStyle(theme: MaterialTheme, variant: "primary" | "ghost") {
  if (variant === "ghost") {
    return {
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: "transparent",
    } as const;
  }
  return {
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primaryContainer,
  } as const;
}

export function btnTextStyle(
  theme: MaterialTheme,
  variant: "primary" | "ghost",
) {
  return {
    color:
      variant === "primary"
        ? theme.colors.onPrimaryContainer
        : theme.colors.onSurface,
    fontFamily: theme.fonts.rounded,
    fontWeight: "700",
  } as const;
}

export const makeStyles = (theme: MaterialTheme) =>
  StyleSheet.create({
    root: { flex: 1 },
    content: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },
    card: {
      padding: theme.spacing.md,
    },
    cardTitle: {
      fontSize: 14,
      fontFamily: theme.fonts.rounded,
      fontWeight: "900",
      marginBottom: theme.spacing.sm,
    },

    btnWide: {
      minHeight: 44,
      paddingHorizontal: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    btn: {
      minHeight: 40,
      paddingHorizontal: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },
    btnSm: {
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    imageRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
      alignItems: "center",
    },
    imagePreview: {
      width: 96,
      height: 96,
      borderRadius: theme.radius.md,
      backgroundColor: "rgba(0,0,0,0.08)",
    },

    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 6,
    },

    rowBetween: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },

    sheetBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
    },
    sheetWrap: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: theme.spacing.md,
    },
    sheet: {
      padding: theme.spacing.md,
      gap: 10,
    },
    sheetTitle: {
      fontFamily: theme.fonts.rounded,
      fontWeight: "900",
      fontSize: 14,
      marginBottom: 6,
    },
    sheetBtn: {
      minHeight: 44,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      paddingHorizontal: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    sheetBtnText: {
      fontFamily: theme.fonts.rounded,
      fontWeight: "800",
    },

    categoryRow: {
      minHeight: 44,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.divider,
      paddingHorizontal: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },

    customRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    customInput: {
      flex: 1,
      minHeight: 42,
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: 12,
      fontFamily: theme.fonts.sans,
    },
    customBtn: {
      minHeight: 42,
      paddingHorizontal: theme.spacing.md,
      alignItems: "center",
      justifyContent: "center",
    },

    groupRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      overflow: "hidden",
    },
    trashBtn: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
    },

    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
      gap: 10,
    },
    checkbox: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    groupChip: {
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: theme.radius.pill,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    qtyWrap: {
      alignItems: "center",
      justifyContent: "center",
      minWidth: 92,
    },
    qtyBtn: {
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
    },
  });
