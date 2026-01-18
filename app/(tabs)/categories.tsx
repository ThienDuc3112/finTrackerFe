import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";

import { useTheme } from "@/hooks/use-theme";
import type { Category } from "@/types/money";
import {
  CategoriesAtom,
  UpsertCategoryAtom,
  DeleteCategoryAtom,
} from "@/contexts/init";

import { CategoryRow } from "@/components/categories/row";
import { CategoryEditorModal } from "@/components/categories/editorModal";

export default function CategoriesPage() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [cats] = useAtom(CategoriesAtom);
  useEffect(() => {
    console.log(cats);
  }, [cats]);
  const upsert = useSetAtom(UpsertCategoryAtom);
  const del = useSetAtom(DeleteCategoryAtom);

  const list = React.useMemo(() => {
    return [...cats].sort((a, b) => a.name.localeCompare(b.name));
  }, [cats]);

  const [editorOpen, setEditorOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);

  const openNew = React.useCallback(() => {
    setEditing(null);
    setEditorOpen(true);
  }, []);

  const openEdit = React.useCallback((c: Category) => {
    setEditing(c);
    setEditorOpen(true);
  }, []);

  const close = React.useCallback(() => setEditorOpen(false), []);

  const onSave = React.useCallback(
    async (cat: Category) => {
      await upsert(cat);
      setEditorOpen(false);
    },
    [upsert],
  );

  const onMenu = React.useCallback(
    (c: Category) => {
      Alert.alert(c.name, undefined, [
        { text: "Edit", onPress: () => openEdit(c) },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete category?",
              "This will also remove related transactions (FK cascade).",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => del(c.name),
                },
              ],
            );
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [openEdit, del],
  );

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View>
            <CategoryRow
              theme={theme}
              item={item}
              onPress={openEdit}
              onMenu={onMenu}
            />
            <View style={styles.divider} />
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Pressable
              onPress={openNew}
              android_ripple={{ color: theme.colors.ripple }}
              style={styles.addWide}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color={theme.colors.onSurface}
              />
              <Text style={styles.addWideText}>ADD NEW CATEGORY</Text>
            </Pressable>
          </View>
        }
      />

      <CategoryEditorModal
        theme={theme}
        visible={editorOpen}
        initial={editing}
        onClose={close}
        onSave={onSave}
      />
    </SafeAreaView>
  );
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      fontWeight: "900",
      fontFamily: theme.fonts.rounded,
      color: theme.colors.onBackground,
    },
    headerBtn: {
      width: 40,
      height: 40,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primaryContainer,
    },
    divider: {
      marginLeft: theme.spacing.lg + 40 + 12, // align under text (skip icon + gap)
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.divider,
    },
    footer: {
      padding: theme.spacing.lg,
    },
    addWide: {
      height: 48,
      borderRadius: theme.radius.pill,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    addWideText: {
      color: theme.colors.onSurface,
      fontWeight: "900",
      fontFamily: theme.fonts.rounded,
      letterSpacing: 0.5,
    },
  });
