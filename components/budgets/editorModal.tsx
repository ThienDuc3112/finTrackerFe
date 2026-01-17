import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { categoryMeta } from "@/contexts/init";

export type BudgetEditorPayload = {
  category: string;
  monthLabel: string; // e.g. "January, 2026"
  limit: number; // numeric limit
};

type Props = {
  theme: MaterialTheme;
  visible: boolean;
  title?: string; // "Edit budget" | "Set budget"
  category: string;
  monthLabel: string;
  initialLimit?: number | null; // if editing
  onClose: () => void;
  onSubmit: (payload: BudgetEditorPayload) => void;
};

export function BudgetEditorModal({
  theme,
  visible,
  title = "Edit budget",
  category,
  monthLabel,
  initialLimit = null,
  onClose,
  onSubmit,
}: Props): React.ReactElement {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if (!visible) return;
    setText(initialLimit == null ? "" : String(initialLimit));
  }, [visible, initialLimit]);

  const parsed = React.useMemo(() => {
    const cleaned = text.replace(/[^\d]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  }, [text]);

  const meta = categoryMeta(theme, category);

  const submit = React.useCallback(() => {
    if (parsed == null) return;
    onSubmit({ category, monthLabel, limit: parsed });
  }, [parsed, onSubmit, category, monthLabel]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.55)" }]}
          onPress={onClose}
        />

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.divider,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            {title}
          </Text>

          <View
            style={[
              styles.categoryBox,
              {
                borderColor: theme.colors.outline,
                borderRadius: theme.radius.lg,
              },
            ]}
          >
            <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
              <Ionicons
                name={meta.iconName}
                size={22}
                color={theme.colors.onPrimary}
              />
            </View>

            <Text
              style={[styles.categoryText, { color: theme.colors.onSurface }]}
            >
              {category}
            </Text>
          </View>

          <View style={styles.limitRow}>
            <Text
              style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
            >
              Limit
            </Text>

            <View
              style={[
                styles.inputWrap,
                {
                  borderColor: theme.colors.outline,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              <TextInput
                value={text}
                onChangeText={setText}
                keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
                placeholder="0"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                selectionColor={theme.colors.primary}
                style={[styles.input, { color: theme.colors.onSurface }]}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
            </View>
          </View>

          <Text
            style={[styles.month, { color: theme.colors.onSurfaceVariant }]}
          >
            Month: {monthLabel}
          </Text>

          <View style={styles.btnRow}>
            <Pressable
              onPress={onClose}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                styles.btn,
                {
                  borderColor: theme.colors.primary,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <Text style={[styles.btnText, { color: theme.colors.primary }]}>
                CANCEL
              </Text>
            </Pressable>

            <Pressable
              onPress={submit}
              disabled={parsed == null}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                styles.btn,
                {
                  borderColor: theme.colors.primary,
                  borderRadius: theme.radius.md,
                  opacity: parsed == null ? 0.45 : 1,
                },
              ]}
            >
              <Text style={[styles.btnText, { color: theme.colors.primary }]}>
                SET
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, justifyContent: "center", alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  card: {
    width: "88%",
    maxWidth: 520,
    borderWidth: 1,
    padding: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 14,
  },
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: { fontSize: 24, fontWeight: "900" },
  limitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  label: { fontSize: 18, fontWeight: "800" },
  inputWrap: {
    flex: 1,
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: { fontSize: 18, fontWeight: "900" },
  month: { textAlign: "center", marginTop: 8, fontSize: 16, fontWeight: "700" },
  btnRow: { flexDirection: "row", gap: 14, marginTop: 18 },
  btn: { flex: 1, borderWidth: 2, paddingVertical: 12, alignItems: "center" },
  btnText: { fontSize: 18, fontWeight: "900", letterSpacing: 1.2 },
});
