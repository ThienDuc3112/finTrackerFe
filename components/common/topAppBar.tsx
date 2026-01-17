import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  title: string;
  onPressMenu?: () => void;
  onPressSearch?: () => void;
  showDivider?: boolean;
};

export function TopAppBar({
  theme,
  title,
  onPressMenu,
  onPressSearch,
  showDivider = false,
}: Props): React.ReactElement {
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.background,
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: theme.colors.divider,
        },
      ]}
    >
      <Pressable
        onPress={onPressMenu}
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
        style={[styles.title, { color: theme.colors.onBackground }]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <Pressable
        onPress={onPressSearch}
        hitSlop={10}
        android_ripple={{ color: theme.colors.ripple, borderless: true }}
        style={styles.iconBtn}
      >
        <MaterialIcons
          name="search"
          size={24}
          color={theme.colors.onBackground}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
