import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useSetAtom } from "jotai";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { BootstrapAtom } from "@/contexts/init";
import { RudeRemarkGate } from "@/components/rudeRemarks/rudeRemarkGate";

export const unstable_settings = {
  anchor: "(tabs)",
};

function Bootstrapper() {
  const bootstrap = useSetAtom(BootstrapAtom);

  React.useEffect(() => {
    bootstrap().catch(console.error);
  }, [bootstrap]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Bootstrapper />
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="manual" options={{ headerShown: false }} />
          <Stack.Screen name="scan" options={{ headerShown: true }} />
          <Stack.Screen name="speechToText" options={{ headerShown: true }} />
        </Stack>
        <RudeRemarkGate />
        <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
}
