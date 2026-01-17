import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { btnStyle, btnTextStyle, cardStyle, makeStyles } from "../styles";
import { Category } from "@/types/money";

type Props = {
  theme: MaterialTheme;
  visible: boolean;
  categories: readonly Category[];
  initialValue: string | null;
  onPick: (value: string) => void;
  onClose: () => void;
};

export function CategoryPickerSheet({
  theme,
  visible,
  categories,
  initialValue,
  onPick,
  onClose,
}: Props) {
  const s = makeStyles(theme);
  const [custom, setCustom] = React.useState("");

  React.useEffect(() => {
    if (visible) setCustom("");
  }, [visible]);

  const pickCustom = () => {
    const v = custom.trim();
    if (!v) return;
    onPick(v);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={s.sheetBackdrop} onPress={onClose} />
      <View style={s.sheetWrap}>
        <View style={[s.sheet, cardStyle(theme)]}>
          <Text style={[s.sheetTitle, { color: theme.colors.onSurface }]}>
            Pick a category
          </Text>

          <ScrollView style={{ maxHeight: 320 }}>
            {categories.map((c) => {
              const selected =
                (initialValue || "").toLowerCase() === c.name.toLowerCase();
              return (
                <Pressable
                  key={c.name}
                  onPress={() => onPick(c.name)}
                  android_ripple={{ color: theme.colors.ripple }}
                  style={[
                    s.categoryRow,
                    selected && { borderColor: theme.colors.primary },
                  ]}
                >
                  <Text
                    style={{ color: theme.colors.onSurface, fontWeight: "700" }}
                  >
                    {c.name}
                  </Text>
                  {selected ? (
                    <MaterialIcons
                      name="check"
                      size={18}
                      color={theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={s.customRow}>
            <TextInput
              value={custom}
              onChangeText={setCustom}
              placeholder="Or type a custom category…"
              placeholderTextColor={theme.colors.onSurfaceVariant}
              style={[
                s.customInput,
                {
                  color: theme.colors.onSurface,
                  borderColor: theme.colors.divider,
                },
              ]}
            />
            <Pressable
              onPress={pickCustom}
              android_ripple={{ color: theme.colors.ripple }}
              style={[s.customBtn, btnStyle(theme, "primary")]}
            >
              <Text style={btnTextStyle(theme, "primary")}>Use</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={onClose}
            android_ripple={{ color: theme.colors.ripple }}
            style={[s.sheetBtn, { justifyContent: "center" }]}
          >
            <Text
              style={[s.sheetBtnText, { color: theme.colors.onSurfaceVariant }]}
            >
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
