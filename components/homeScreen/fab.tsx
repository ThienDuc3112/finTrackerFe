import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  Text,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { router } from "expo-router";

type Props = {
  theme: MaterialTheme;
  bottom?: number; // bump above tab bar
};

const FAB_SIZE = 56;
const MINI_SIZE = 44;

export function Fab({ theme, bottom = 86 }: Props): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const progress = React.useRef(new Animated.Value(0)).current;

  const setOpenAnimated = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      Animated.timing(progress, {
        toValue: next ? 1 : 0,
        duration: 170,
        useNativeDriver: true,
      }).start();
    },
    [progress],
  );

  const close = React.useCallback(
    () => setOpenAnimated(false),
    [setOpenAnimated],
  );
  const toggle = React.useCallback(
    () => setOpenAnimated(!open),
    [open, setOpenAnimated],
  );

  const actionPress = (fn: () => void) => () => {
    close();
    fn();
  };

  const actions = [
    // {
    //   label: "Speech2Text",
    //   icon: "keyboard-voice" as const,
    //   onPress: actionPress(() => router.push("/speechToText")),
    // },
    {
      label: "Auto",
      icon: "auto-awesome" as const,
      onPress: actionPress(() => router.push("/scan")),
    },
    {
      label: "Manual",
      icon: "edit" as const,
      onPress: actionPress(() => router.push("/manual")),
    },
  ];

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      {/* ...scrim... */}
      <Pressable
        pointerEvents={open ? "auto" : "none"}
        onPress={close}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          style={[
            styles.scrim,
            {
              // keep dark scrim, just drive opacity via animation
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        />
      </Pressable>

      <View
        pointerEvents="box-none"
        style={[styles.stack, { bottom, right: 18 }]}
      >
        {actions.map((a, idx) => {
          const translateY = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, idx + 1],
          });

          return (
            <Animated.View
              key={a.label}
              pointerEvents={open ? "auto" : "none"}
              style={[
                styles.actionRow,
                {
                  bottom: 0,
                  opacity: progress,
                  transform: [{ translateY }, { scale: progress }],
                },
              ]}
            >
              <View
                style={[
                  styles.labelPill,
                  {
                    backgroundColor: theme.colors.surfaceVariant,
                    borderColor: theme.colors.outline,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.labelText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {a.label}
                </Text>
              </View>

              <Pressable
                onPress={a.onPress}
                android_ripple={{
                  color: theme.colors.ripple,
                  borderless: true,
                }}
                style={[
                  styles.miniFab,
                  {
                    width: MINI_SIZE,
                    height: MINI_SIZE,
                    borderRadius: MINI_SIZE / 2,
                    backgroundColor: theme.colors.secondaryContainer,
                  },
                ]}
              >
                <MaterialIcons
                  name={a.icon}
                  size={22}
                  color={theme.colors.onSecondaryContainer}
                />
              </Pressable>
            </Animated.View>
          );
        })}

        <Pressable
          onPress={toggle}
          android_ripple={{ color: theme.colors.ripple, borderless: true }}
          style={[
            styles.fab,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              backgroundColor: theme.colors.primaryContainer,
            },
          ]}
        >
          <MaterialIcons
            name={open ? "close" : "add"}
            size={28}
            color={theme.colors.onPrimaryContainer}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: "#000",
  },
  stack: {
    position: "absolute",
    alignItems: "flex-end",
    flex: 1,
    flexDirection: "column",
    // borderWidth: 1,
    rowGap: 16,
  },
  actionRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    right: 6,
    // borderWidth: 1,
  },
  labelPill: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600",
  },
  miniFab: {
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.14,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      default: {},
    }),
  },
  fab: {
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
