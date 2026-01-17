import React from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { makeStyles } from "./styles";
import { dateToHM, dateToYMD } from "./utils";

export function DateTimeModal(props: {
  theme: MaterialTheme;
  visible: boolean;
  value: Date;
  onClose: () => void;
  onSave: (d: Date) => void;
}) {
  const { theme, visible, value, onClose, onSave } = props;
  const styles = makeStyles(theme);

  const [ymd, setYmd] = React.useState(dateToYMD(value));
  const [hm, setHm] = React.useState(dateToHM(value));

  React.useEffect(() => {
    if (!visible) return;
    setYmd(dateToYMD(value));
    setHm(dateToHM(value));
  }, [visible, value]);

  const save = () => {
    const isoLocal = `${ymd}T${hm}:00`;
    const d = new Date(isoLocal);
    if (Number.isNaN(d.getTime())) {
      Alert.alert("Invalid date/time", "Use YYYY-MM-DD and HH:mm");
      return;
    }
    onSave(d);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.sheetHeader}>
            <Text
              style={[styles.sheetTitle, { color: theme.colors.onSurface }]}
            >
              Date & time
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialIcons
                name="close"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
          </View>

          <View style={{ gap: theme.spacing.sm }}>
            <View>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Date (YYYY-MM-DD)
              </Text>
              <TextInput
                value={ymd}
                onChangeText={setYmd}
                placeholder="2026-01-17"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                style={[
                  styles.textInput,
                  {
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              />
            </View>

            <View>
              <Text
                style={[
                  styles.fieldLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Time (HH:mm)
              </Text>
              <TextInput
                value={hm}
                onChangeText={setHm}
                placeholder="17:49"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                style={[
                  styles.textInput,
                  {
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              />
            </View>

            <Pressable
              onPress={save}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: theme.radius.md,
                },
              ]}
            >
              <MaterialIcons
                name="check"
                size={18}
                color={theme.colors.onPrimaryContainer}
              />
              <Text
                style={{
                  color: theme.colors.onPrimaryContainer,
                  fontWeight: "700",
                }}
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
