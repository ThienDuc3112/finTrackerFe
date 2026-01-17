import React from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  bottom?: number; // let you bump above tab bar
  onPress?: () => void;
};

export function Fab({
  theme,
  bottom = 86,
  onPress,
}: Props): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: theme.colors.ripple, borderless: true }}
      style={[
        styles.fab,
        {
          bottom,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: theme.radius.pill,
        },
      ]}
    >
      <MaterialIcons
        name="add"
        size={28}
        color={theme.colors.onPrimaryContainer}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: { elevation: 6 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
      },
      default: {},
    }),
  },
});
