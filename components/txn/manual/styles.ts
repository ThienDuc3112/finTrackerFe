import { StyleSheet } from "react-native";
import type { MaterialTheme } from "@/constants/theme";

export const makeStyles = (theme: MaterialTheme) =>
  StyleSheet.create({
    root: { flex: 1 },

    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    iconBtn: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.radius.pill,
    },
    topTitleWrap: { flex: 1, alignItems: "center" },
    topTitle: { fontWeight: "800", fontSize: 14 },

    content: { paddingTop: theme.spacing.lg, gap: theme.spacing.sm },
    row2: { flexDirection: "row", gap: theme.spacing.sm },

    pillField: {
      flex: 1,
      height: 54,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    blockInput: {
      height: 54,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: theme.spacing.md,
      fontSize: 16,
    },

    calcWrap: {
      flex: 1,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    amountBox: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      gap: 10,
    },
    currencyChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: theme.radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
    },
    amountText: {
      fontSize: 64,
      fontWeight: "900",
      textAlign: "right",
      includeFontPadding: false,
    },

    keypad: {
      flex: 1,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: theme.radius.lg,
      overflow: "hidden",
    },
    keyRow: { flex: 1, flexDirection: "row" },
    key: { flex: 1, alignItems: "center", justifyContent: "center" },

    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      padding: theme.spacing.lg,
      justifyContent: "center",
    },
    sheet: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.outline,
      overflow: "hidden",
      maxHeight: "75%",
    },
    sheetHeader: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
    },
    sheetTitle: { fontSize: 16, fontWeight: "900" },
    sep: { height: StyleSheet.hairlineWidth },
    pickRow: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    pickText: { fontSize: 16, fontWeight: "700" },

    fieldLabel: { fontSize: 12, fontWeight: "800", marginBottom: 6 },
    textInput: {
      height: 46,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: theme.spacing.md,
      fontSize: 16,
    },
    primaryBtn: {
      height: 46,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.outline,
      marginTop: 4,
    },
  });
