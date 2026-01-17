import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import type { GroupState } from "../types";
import { cardStyle, makeStyles } from "../styles";

type Props = {
  theme: MaterialTheme;
  visible: boolean;
  groups: GroupState[];
  activeGroupId: string;
  onMoveTo: (groupId: string) => void;
  onAddGroup: () => void;
  onClose: () => void;
};

export function MoveToGroupSheet({
  theme,
  visible,
  groups,
  activeGroupId,
  onMoveTo,
  onAddGroup,
  onClose,
}: Props) {
  const s = makeStyles(theme);

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
            Move item to
          </Text>

          {groups.map((g) => {
            const label = g.category ? g.category : "Pick category…";
            const selected = g.id === activeGroupId;

            return (
              <Pressable
                key={g.id}
                onPress={() => onMoveTo(g.id)}
                android_ripple={{ color: theme.colors.ripple }}
                style={[
                  s.categoryRow,
                  selected && { borderColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={{ color: theme.colors.onSurface, fontWeight: "700" }}
                >
                  {label}
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

          <Pressable
            onPress={onAddGroup}
            android_ripple={{ color: theme.colors.ripple }}
            style={s.sheetBtn}
          >
            <MaterialIcons name="add" size={20} color={theme.colors.primary} />
            <Text style={[s.sheetBtnText, { color: theme.colors.onSurface }]}>
              Add new group
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            android_ripple={{ color: theme.colors.ripple }}
            style={[s.sheetBtn, { justifyContent: "center" }]}
          >
            <Text
              style={[s.sheetBtnText, { color: theme.colors.onSurfaceVariant }]}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
