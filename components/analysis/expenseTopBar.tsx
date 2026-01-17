import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  title: string;
  onMenu: () => void;
  onSearch: () => void;
};

export function ExpenseTopBar({
  theme,
  title,
  onMenu,
  onSearch,
}: Props): React.ReactElement {
  return (
    <View
      style={[
        styles.root,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderBottomColor: theme.colors.divider,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <Pressable
        onPress={onMenu}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.iconBtn}
      >
        <MaterialIcons
          name="menu"
          size={26}
          color={theme.colors.onBackground}
        />
      </Pressable>

      <Text
        style={[
          styles.title,
          { color: theme.colors.onBackground, fontFamily: theme.fonts.rounded },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <Pressable
        onPress={onSearch}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.iconBtn}
      >
        <MaterialIcons
          name="search"
          size={26}
          color={theme.colors.onBackground}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 0.2,
  },
});
