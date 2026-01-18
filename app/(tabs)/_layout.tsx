import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopAppBar } from "@/components/common/topAppBar";

export default function TabLayout() {
  const theme = useTheme();

  const renderHeader = React.useCallback(
    (_props: any) => {
      const title = "FinAunty";

      return (
        <SafeAreaView
          edges={["top"]}
          style={{ backgroundColor: theme.colors.background }}
        >
          <TopAppBar
            theme={theme}
            title={title}
            onPressMenu={() => {}}
            onPressSearch={() => {}}
            showDivider={false}
          />
        </SafeAreaView>
      );
    },
    [theme],
  );
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: renderHeader,
        tabBarButton: HapticTab,

        // icon/label colors
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,

        // the tab bar itself
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.divider,
          borderTopWidth: Platform.OS === "ios" ? 0.5 : 0,
          elevation: 0, // android shadow
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: ({ color }) => (
            <Ionicons name="pie-chart-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budgets",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Ionicons name="pricetag-outline" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
