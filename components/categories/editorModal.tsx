import React from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { MaterialTheme, OtherColorKey } from "@/constants/theme";
import type { Category } from "@/types/money";
import { colorKeys, resolveCategoryColor } from "./utils";

type Props = {
  theme: MaterialTheme;
  visible: boolean;
  initial?: Category | null; // null => creating new
  onClose: () => void;
  onSave: (cat: Category) => void;
};

const ICON_CHOICES = [
  "pricetag",
  "restaurant",
  "wine",
  "cart",
  "receipt",
  "bus",
  "car",
  "train",
  "home",
  "shirt",
  "game-controller",
  "film",
  "heart",
  "cash",
  "gift",
  "fitness",
  "medical",
  "sparkles",
] as const;

export function CategoryEditorModal({
  theme,
  visible,
  initial = null,
  onClose,
  onSave,
}: Props) {
  const isEdit = !!initial;

  const [name, setName] = React.useState(initial?.name ?? "");
  const [iconName, setIconName] = React.useState<string>(
    initial?.iconName ?? "pricetag",
  );
  const [colorKey, setColorKey] = React.useState<OtherColorKey>(
    (initial?.colorKey as any) ?? "sky",
  );

  React.useEffect(() => {
    setName(initial?.name ?? "");
    setIconName(initial?.iconName ?? "pricetag");
    setColorKey((initial?.colorKey as any) ?? "sky");
  }, [initial, visible]);

  const keys = React.useMemo(() => colorKeys(theme), [theme]);

  const save = React.useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter a category name.");
      return;
    }

    // Keep name locked when editing (DB key + avoids breaking existing txns)
    if (isEdit && trimmed !== initial!.name) {
      Alert.alert("Rename not supported", "Edit icon/color for now.");
      return;
    }

    onSave({
      name: trimmed,
      iconName: iconName as any,
      colorKey,
    });
  }, [name, iconName, colorKey, onSave, isEdit, initial]);

  const previewBg = resolveCategoryColor(theme, colorKey);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s(theme).backdrop} onPress={onClose}>
        <Pressable style={s(theme).sheet} onPress={() => {}}>
          <View style={s(theme).sheetHeader}>
            <View style={[s(theme).preview, { backgroundColor: previewBg }]}>
              <Ionicons
                name={iconName as any}
                size={18}
                color={theme.colors.onPrimary}
              />
            </View>
            <Text style={s(theme).title}>
              {isEdit ? "Edit category" : "New category"}
            </Text>
          </View>

          <Text style={s(theme).label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={!isEdit}
            placeholder="e.g. Drinks"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            style={s(theme).input}
          />
          {isEdit ? (
            <Text style={s(theme).hint}>
              Name is locked for now (it’s the DB key).
            </Text>
          ) : null}

          <Text style={s(theme).label}>Icon</Text>
          <View style={s(theme).grid}>
            {ICON_CHOICES.map((ic) => {
              const selected = ic === iconName;
              return (
                <Pressable
                  key={ic}
                  onPress={() => setIconName(ic)}
                  android_ripple={{
                    color: theme.colors.ripple,
                    borderless: true,
                  }}
                  style={[
                    s(theme).chip,
                    {
                      borderColor: selected
                        ? theme.colors.primary
                        : theme.colors.outline,
                      backgroundColor: selected
                        ? theme.colors.primaryContainer
                        : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <Ionicons
                    name={ic as any}
                    size={18}
                    color={
                      selected
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurface
                    }
                  />
                </Pressable>
              );
            })}
          </View>

          <Text style={s(theme).label}>Color</Text>
          <View style={s(theme).grid}>
            {keys.map((k: OtherColorKey) => {
              const selected = k === colorKey;
              return (
                <Pressable
                  key={k}
                  onPress={() => setColorKey(k)}
                  android_ripple={{
                    color: theme.colors.ripple,
                    borderless: true,
                  }}
                  style={[
                    s(theme).swatchWrap,
                    {
                      borderColor: selected
                        ? theme.colors.primary
                        : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      s(theme).swatch,
                      { backgroundColor: theme.colors.otherColors[k] },
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>

          <View style={s(theme).actions}>
            <Pressable
              onPress={onClose}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                s(theme).btn,
                {
                  backgroundColor: theme.colors.surfaceVariant,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <Text
                style={[s(theme).btnText, { color: theme.colors.onSurface }]}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={save}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                s(theme).btn,
                {
                  backgroundColor: theme.colors.primaryContainer,
                  borderColor: theme.colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  s(theme).btnText,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = (theme: MaterialTheme) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.xl,
      borderTopRightRadius: theme.radius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: theme.spacing.md,
    },
    preview: {
      width: 32,
      height: 32,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      color: theme.colors.onSurface,
      fontSize: 16,
      fontWeight: "900",
      fontFamily: theme.fonts.rounded,
    },
    label: {
      marginTop: theme.spacing.sm,
      marginBottom: 6,
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    input: {
      height: 44,
      paddingHorizontal: 12,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.onSurface,
    },
    hint: {
      marginTop: 6,
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    chip: {
      width: 44,
      height: 44,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },
    swatchWrap: {
      width: 34,
      height: 34,
      borderRadius: 999,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    swatch: {
      width: 26,
      height: 26,
      borderRadius: 999,
    },
    actions: {
      flexDirection: "row",
      gap: 12,
      marginTop: theme.spacing.lg,
    },
    btn: {
      flex: 1,
      height: 44,
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    btnText: {
      fontWeight: "900",
      fontFamily: theme.fonts.rounded,
    },
  });
