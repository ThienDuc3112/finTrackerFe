import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MaterialTheme } from "@/constants/theme";

type Props = {
  theme: MaterialTheme;
  title: string;
};

export function SectionHeader({ theme, title }: Props): React.ReactElement {
  return (
    <View
      style={{
        paddingTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
      }}
    >
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        {title}
      </Text>
      <View style={[styles.line, { backgroundColor: theme.colors.divider }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "800", marginBottom: 8 },
  line: { height: 2, borderRadius: 2 },
});
