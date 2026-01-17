import React from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { makeStyles } from "./styles";

export function PickerModal(props: {
  theme: MaterialTheme;
  title: string;
  visible: boolean;
  items: readonly string[];
  selected?: string | null;
  onClose: () => void;
  onPick: (v: string) => void;
}) {
  const { theme, title, visible, items, selected, onClose, onPick } = props;
  const styles = makeStyles(theme);

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
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <MaterialIcons
                name="close"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </Pressable>
          </View>

          <FlatList
            data={[...items]}
            keyExtractor={(x) => x}
            ItemSeparatorComponent={() => (
              <View
                style={[styles.sep, { backgroundColor: theme.colors.divider }]}
              />
            )}
            renderItem={({ item }) => {
              const active = item === selected;
              return (
                <Pressable
                  onPress={() => onPick(item)}
                  android_ripple={{ color: theme.colors.ripple }}
                  style={[
                    styles.pickRow,
                    active && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickText,
                      {
                        color: active
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSurface,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                  {active ? (
                    <MaterialIcons
                      name="check"
                      size={18}
                      color={theme.colors.onPrimaryContainer}
                    />
                  ) : null}
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
