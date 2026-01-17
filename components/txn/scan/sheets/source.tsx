import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { cardStyle, makeStyles } from "../styles";

type Props = {
  theme: MaterialTheme;
  visible: boolean;
  onClose: () => void;
  onCamera: () => void;
  onLibrary: () => void;
};

export function ReceiptSourceSheet({
  theme,
  visible,
  onClose,
  onCamera,
  onLibrary,
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
            Add receipt image
          </Text>

          <Pressable
            onPress={onCamera}
            android_ripple={{ color: theme.colors.ripple }}
            style={s.sheetBtn}
          >
            <MaterialIcons
              name="photo-camera"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[s.sheetBtnText, { color: theme.colors.onSurface }]}>
              Take photo
            </Text>
          </Pressable>

          <Pressable
            onPress={onLibrary}
            android_ripple={{ color: theme.colors.ripple }}
            style={s.sheetBtn}
          >
            <MaterialIcons
              name="photo-library"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={[s.sheetBtnText, { color: theme.colors.onSurface }]}>
              Choose from library
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
