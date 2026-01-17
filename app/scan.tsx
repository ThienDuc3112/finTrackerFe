import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

import { useTheme } from "@/hooks/use-theme";
import type { TxnInput } from "@/types/money";
import {
  btnStyle,
  btnTextStyle,
  cardStyle,
  makeStyles,
} from "@/components/txn/scan/styles";
import {
  GroupState,
  LineState,
  ReceiptApiResponse,
} from "@/components/txn/scan/types";
import { formatMoney, uid } from "@/components/txn/scan/utils";
import {
  normalizePaymentMethod,
  postReceiptImage,
} from "@/components/txn/scan/api";
import { ReceiptSourceSheet } from "@/components/txn/scan/sheets/source";
import { MetadataEditorSheet } from "@/components/txn/scan/sheets/metadataEditor";
import { ItemEditorSheet } from "@/components/txn/scan/sheets/itemEditor";
import { CategoryPickerSheet } from "@/components/txn/scan/sheets/categoryPicker";
import { useAtomValue } from "jotai";
import { CategoriesAtom } from "@/contexts/init";
import { MoveToGroupSheet } from "@/components/txn/scan/sheets/moveToGroup";
import { GroupRow } from "@/components/txn/scan/groupRow";
import { ItemRow } from "@/components/txn/scan/itemRow";

export default function ScanReceiptScreen() {
  const theme = useTheme();
  const s = makeStyles(theme);

  const [sourceOpen, setSourceOpen] = React.useState(false);

  const [imageUri, setImageUri] = React.useState<string | null>(null);
  const [apiData, setApiData] = React.useState<ReceiptApiResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [currency] = React.useState("SGD");
  const [metaEditorOpen, setMetaEditorOpen] = React.useState(false);

  const [itemEditor, setItemEditor] = React.useState<{
    open: boolean;
    lineId: string | null;
    mode: "edit" | "add";
  }>({ open: false, lineId: null, mode: "edit" });

  const [groups, setGroups] = React.useState<GroupState[]>([
    { id: "g1", category: null },
  ]);
  const [lines, setLines] = React.useState<LineState[]>([]);

  const [categoryPicker, setCategoryPicker] = React.useState<{
    open: boolean;
    groupId: string | null;
  }>({
    open: false,
    groupId: null,
  });

  const [moveSheet, setMoveSheet] = React.useState<{
    open: boolean;
    lineId: string | null;
  }>({
    open: false,
    lineId: null,
  });

  const groupTotal = React.useCallback(
    (groupId: string) =>
      lines
        .filter((l) => l.groupId === groupId && l.selected && l.qty > 0)
        .reduce((sum, l) => sum + l.unitPrice * l.qty, 0),
    [lines],
  );

  const initFromApi = React.useCallback((data: ReceiptApiResponse) => {
    const g1: GroupState = { id: "g1", category: null };
    setGroups([g1]);

    const nextLines: LineState[] = data.items.map((it) => ({
      id: uid("line"),
      name: it.item,
      unitPrice: it.price,
      maxQty: Math.max(1, it.quantity),
      qty: Math.max(1, it.quantity),
      selected: true,
      groupId: g1.id,
    }));

    setLines(nextLines);
    setCategoryPicker({ open: true, groupId: g1.id });
  }, []);

  const pickFromLibrary = React.useCallback(async () => {
    setSourceOpen(false);

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 1,
      quality: 0.85,
    });

    if (result.canceled) return;
    const uri = result.assets[0]?.uri;
    if (!uri) return;

    setImageUri(uri);
  }, []);

  const takePhoto = React.useCallback(async () => {
    setSourceOpen(false);

    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (result.canceled) return;

    const uri = result.assets[0]?.uri;
    if (!uri) return;

    setImageUri(uri);
  }, []);

  // Auto-post to API when image changes
  React.useEffect(() => {
    if (!imageUri) return;

    let alive = true;
    (async () => {
      setLoading(true);
      setApiData(null);
      try {
        const data = await postReceiptImage(imageUri);
        if (!alive) return;
        setApiData(data);
        initFromApi(data);
      } catch (e) {
        if (!alive) return;
        Alert.alert("Failed", "Could not parse receipt (stub).");
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [imageUri, initFromApi]);

  const resetAll = React.useCallback(() => {
    setImageUri(null);
    setApiData(null);
    setLoading(false);
    setGroups([{ id: "g1", category: null }]);
    setLines([]);
    setCategoryPicker({ open: false, groupId: null });
    setMoveSheet({ open: false, lineId: null });
  }, []);

  const toggleLine = React.useCallback((lineId: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        const nextSelected = !l.selected;
        return {
          ...l,
          selected: nextSelected,
          qty: nextSelected ? (l.qty > 0 ? l.qty : l.maxQty) : 0,
        };
      }),
    );
  }, []);

  const decQty = React.useCallback((lineId: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        if (!l.selected) return l;
        const next = Math.max(0, l.qty - 1);
        return { ...l, qty: next, selected: next > 0 };
      }),
    );
  }, []);

  const incQty = React.useCallback((lineId: string) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== lineId) return l;
        const nextQty = Math.min(l.maxQty, (l.selected ? l.qty : 0) + 1);
        return { ...l, qty: nextQty, selected: nextQty > 0 };
      }),
    );
  }, []);

  const addGroup = React.useCallback(() => {
    const g: GroupState = { id: uid("g"), category: null };
    setGroups((prev) => [...prev, g]);
    setCategoryPicker({ open: true, groupId: g.id });
    return g.id;
  }, []);

  const removeGroup = React.useCallback((groupId: string) => {
    setGroups((prevGroups) => {
      if (prevGroups.length <= 1) return prevGroups;

      const nextGroups = prevGroups.filter((g) => g.id !== groupId);
      const fallback = nextGroups[0]?.id ?? prevGroups[0]?.id ?? "g1";

      setLines((prevLines) =>
        prevLines.map((l) =>
          l.groupId === groupId ? { ...l, groupId: fallback } : l,
        ),
      );

      return nextGroups;
    });
  }, []);

  const setGroupCategory = React.useCallback(
    (groupId: string, category: string) => {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, category } : g)),
      );
    },
    [],
  );

  const openMoveForLine = React.useCallback((lineId: string) => {
    setMoveSheet({ open: true, lineId });
  }, []);

  const moveActiveGroupId =
    (moveSheet.lineId &&
      lines.find((l) => l.id === moveSheet.lineId)?.groupId) ||
    groups[0]?.id ||
    "g1";

  const moveLineTo = React.useCallback(
    (groupId: string) => {
      const lineId = moveSheet.lineId;
      if (!lineId) return;

      setLines((prev) =>
        prev.map((l) => (l.id === lineId ? { ...l, groupId } : l)),
      );
      setMoveSheet({ open: false, lineId: null });

      const g = groups.find((x) => x.id === groupId);
      if (!g?.category) setCategoryPicker({ open: true, groupId });
    },
    [moveSheet.lineId, groups],
  );

  const confirm = React.useCallback(() => {
    if (!apiData) return;

    const built: TxnInput[] = [];

    for (const g of groups) {
      const total = groupTotal(g.id);
      if (total <= 0) continue;

      if (!g.category) {
        Alert.alert(
          "Missing category",
          "Please pick a category for each non-empty group.",
        );
        setCategoryPicker({ open: true, groupId: g.id });
        return;
      }

      const pickedLines = lines.filter(
        (l) => l.groupId === g.id && l.selected && l.qty > 0,
      );
      const note = pickedLines
        .slice(0, 8)
        .map((l) => `${l.name} x${l.qty}`)
        .join(", ")
        .concat(pickedLines.length > 8 ? "…" : "");

      built.push({
        amount: -total,
        currency,
        category: g.category,
        method: normalizePaymentMethod(apiData.payment_method),
        occurredAt: new Date(),
        merchant: apiData.merchant,
        note: note || "Receipt split",
      });
    }

    if (!built.length) {
      Alert.alert("Nothing selected", "Pick at least one item.");
      return;
    }

    Alert.alert("Transactions (stub)", JSON.stringify(built, null, 2));
    console.log("Built transactions:", built);
  }, [apiData, currency, groups, groupTotal, lines]);

  const openEditItem = React.useCallback((lineId: string) => {
    setItemEditor({ open: true, lineId, mode: "edit" });
  }, []);

  const openAddItem = React.useCallback(() => {
    setItemEditor({ open: true, lineId: null, mode: "add" });
  }, []);

  const removeItem = React.useCallback((lineId: string) => {
    setLines((prev) => prev.filter((l) => l.id !== lineId));
    setItemEditor({ open: false, lineId: null, mode: "edit" });
  }, []);

  const saveEditItem = React.useCallback(
    (lineId: string, next: { name: string; price: number }) => {
      setLines((prev) =>
        prev.map((l) =>
          l.id === lineId
            ? { ...l, name: next.name, unitPrice: next.price }
            : l,
        ),
      );
      setItemEditor({ open: false, lineId: null, mode: "edit" });
    },
    [],
  );

  const addItem = React.useCallback(
    (next: { name: string; price: number; quantity?: number }) => {
      const qty = Math.max(1, next.quantity ?? 1);
      const groupId = groups[0]?.id ?? "g1";

      const newLine: LineState = {
        id: uid("line"),
        name: next.name,
        unitPrice: next.price,
        maxQty: qty,
        qty,
        selected: true,
        groupId,
      };

      setLines((prev) => [...prev, newLine]);
      setItemEditor({ open: false, lineId: null, mode: "edit" });
    },
    [groups],
  );

  const categories = useAtomValue(CategoriesAtom);

  return (
    <SafeAreaView
      style={[s.root, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          title: "Scan Receipt",
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
          headerShadowVisible: false,
        }}
      />

      <ReceiptSourceSheet
        theme={theme}
        visible={sourceOpen}
        onClose={() => setSourceOpen(false)}
        onCamera={takePhoto}
        onLibrary={pickFromLibrary}
      />

      <CategoryPickerSheet
        theme={theme}
        visible={categoryPicker.open}
        categories={categories}
        initialValue={
          categoryPicker.groupId
            ? (groups.find((g) => g.id === categoryPicker.groupId)?.category ??
              null)
            : null
        }
        onPick={(v) => {
          if (categoryPicker.groupId)
            setGroupCategory(categoryPicker.groupId, v);
          setCategoryPicker({ open: false, groupId: null });
        }}
        onClose={() => setCategoryPicker({ open: false, groupId: null })}
      />

      <MoveToGroupSheet
        theme={theme}
        visible={moveSheet.open}
        groups={groups}
        activeGroupId={moveActiveGroupId}
        onMoveTo={moveLineTo}
        onAddGroup={() => {
          const newId = addGroup();
          moveLineTo(newId);
        }}
        onClose={() => setMoveSheet({ open: false, lineId: null })}
      />

      <MetadataEditorSheet
        theme={theme}
        visible={metaEditorOpen && !!apiData}
        initialMerchant={apiData?.merchant ?? ""}
        initialPaymentMethod={apiData?.payment_method ?? "CARD"}
        initialTotal={apiData?.total ?? 0}
        onClose={() => setMetaEditorOpen(false)}
        onSave={(next) => {
          setApiData((prev) => (prev ? { ...prev, ...next } : prev));
          setMetaEditorOpen(false);
        }}
      />

      <ItemEditorSheet
        theme={theme}
        visible={itemEditor.open}
        title={itemEditor.mode === "add" ? "Add item" : "Edit item"}
        initialName={
          itemEditor.mode === "edit"
            ? (lines.find((l) => l.id === itemEditor.lineId)?.name ?? "")
            : ""
        }
        initialPrice={
          itemEditor.mode === "edit"
            ? (lines.find((l) => l.id === itemEditor.lineId)?.unitPrice ?? 0)
            : 0
        }
        showQuantity={itemEditor.mode === "add"}
        initialQuantity={1}
        onClose={() =>
          setItemEditor({ open: false, lineId: null, mode: "edit" })
        }
        onSave={(next) => {
          if (itemEditor.mode === "add") {
            addItem(next);
            return;
          }
          if (itemEditor.lineId) {
            saveEditItem(itemEditor.lineId, {
              name: next.name,
              price: next.price,
            });
          }
        }}
        onRemove={
          itemEditor.mode === "edit" && itemEditor.lineId
            ? () => removeItem(itemEditor.lineId ?? "")
            : undefined
        }
      />

      <ScrollView contentContainerStyle={s.content}>
        {/* 1) Pick image */}
        <View style={[s.card, cardStyle(theme)]}>
          <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>
            1) Receipt image
          </Text>

          {imageUri ? (
            <View style={s.imageRow}>
              <Image source={{ uri: imageUri }} style={s.imagePreview} />
              <View style={{ flex: 1 }}>
                <Text
                  style={{ color: theme.colors.onSurface, fontWeight: "700" }}
                >
                  Image selected
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: theme.spacing.md,
                  }}
                >
                  <Pressable
                    onPress={() => setSourceOpen(true)}
                    android_ripple={{ color: theme.colors.ripple }}
                    style={[s.btn, btnStyle(theme, "ghost")]}
                  >
                    <Text style={btnTextStyle(theme, "ghost")}>Change</Text>
                  </Pressable>

                  <Pressable
                    onPress={resetAll}
                    android_ripple={{ color: theme.colors.ripple }}
                    style={[s.btn, btnStyle(theme, "ghost")]}
                  >
                    <Text style={btnTextStyle(theme, "ghost")}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => setSourceOpen(true)}
              android_ripple={{ color: theme.colors.ripple }}
              style={[s.btnWide, btnStyle(theme, "primary")]}
            >
              <MaterialIcons
                name="add-a-photo"
                size={18}
                color={theme.colors.onPrimaryContainer}
              />
              <Text style={btnTextStyle(theme, "primary")}>
                Pick receipt image
              </Text>
            </Pressable>
          )}
        </View>

        {/* Merchant */}
        <View style={s.rowBetween}>
          <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>
            Metadata
          </Text>

          <Pressable
            onPress={() => setMetaEditorOpen(true)}
            disabled={!apiData}
            android_ripple={{ color: theme.colors.ripple }}
            style={[
              s.btnSm,
              btnStyle(theme, "ghost"),
              !apiData && { opacity: 0.5 },
            ]}
          >
            <MaterialIcons
              name="edit"
              size={16}
              color={theme.colors.onSurface}
            />
            <Text style={[btnTextStyle(theme, "ghost"), { fontSize: 12 }]}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={[s.card, cardStyle(theme)]}>
          {loading ? (
            <View style={s.loadingRow}>
              <ActivityIndicator />
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                Uploading & parsing…
              </Text>
            </View>
          ) : apiData ? (
            <View style={{ gap: 6 }}>
              <Text
                style={{ color: theme.colors.onSurface, fontWeight: "800" }}
              >
                {apiData.merchant}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                Payment: {normalizePaymentMethod(apiData.payment_method)} •
                Receipt total: {formatMoney(currency, apiData.total)}
              </Text>
            </View>
          ) : (
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Select an image to auto-post to the receipt parser.
            </Text>
          )}
        </View>

        {/* Groups */}
        {apiData ? (
          <View style={[s.card, cardStyle(theme)]}>
            <View style={s.rowBetween}>
              <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>
                Groups (transactions)
              </Text>

              <Pressable
                onPress={addGroup}
                android_ripple={{ color: theme.colors.ripple }}
                style={[s.btnSm, btnStyle(theme, "ghost")]}
              >
                <MaterialIcons
                  name="add"
                  size={16}
                  color={theme.colors.onSurface}
                />
                <Text style={[btnTextStyle(theme, "ghost"), { fontSize: 12 }]}>
                  Add
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 10, marginTop: theme.spacing.sm }}>
              {groups.map((g, idx) => (
                <GroupRow
                  key={g.id}
                  theme={theme}
                  currency={currency}
                  group={g}
                  index={idx}
                  total={groupTotal(g.id)}
                  canDelete={groups.length > 1}
                  onPickCategory={() =>
                    setCategoryPicker({ open: true, groupId: g.id })
                  }
                  onDelete={() => removeGroup(g.id)}
                />
              ))}
            </View>

            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: theme.spacing.sm,
              }}
            >
              Tip: tap an item’s “Group” chip to move it to another transaction.
            </Text>
          </View>
        ) : null}

        {/* 4) Items */}
        {apiData ? (
          <View style={[s.card, cardStyle(theme)]}>
            <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>
              Items (select + quantity + grouping)
            </Text>

            <View style={{ marginTop: theme.spacing.sm, gap: 8 }}>
              {lines.map((l) => {
                const g = groups.find((x) => x.id === l.groupId);
                const groupLabel = g?.category ?? "Pick category…";
                return (
                  <ItemRow
                    key={l.id}
                    theme={theme}
                    currency={currency}
                    line={l}
                    groupLabel={groupLabel}
                    onToggle={() => toggleLine(l.id)}
                    onDec={() => decQty(l.id)}
                    onInc={() => incQty(l.id)}
                    onOpenMove={() => openMoveForLine(l.id)}
                    onEdit={() => openEditItem(l.id)}
                  />
                );
              })}
            </View>

            <Pressable
              onPress={openAddItem}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                {
                  marginTop: theme.spacing.sm,
                  minHeight: 44,
                  borderRadius: theme.radius.md,
                  borderWidth: 1,
                  borderColor: theme.colors.divider,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 8,
                },
              ]}
            >
              <MaterialIcons
                name="add"
                size={18}
                color={theme.colors.primary}
              />
              <Text
                style={{ color: theme.colors.onSurface, fontWeight: "900" }}
              >
                Add item
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Confirm */}
        {apiData ? (
          <View style={[s.card, cardStyle(theme)]}>
            <Text style={[s.cardTitle, { color: theme.colors.onSurface }]}>
              Confirm
            </Text>

            <Pressable
              onPress={confirm}
              android_ripple={{ color: theme.colors.ripple }}
              style={[s.btnWide, btnStyle(theme, "primary")]}
            >
              <MaterialIcons
                name="check-circle"
                size={18}
                color={theme.colors.onPrimaryContainer}
              />
              <Text style={btnTextStyle(theme, "primary")}>
                Confirm & build transactions
              </Text>
            </Pressable>

            <Text
              style={{
                color: theme.colors.onSurfaceVariant,
                marginTop: theme.spacing.sm,
              }}
            >
              This will Alert() the TxnInput[] (stub). TODO: Edit this
            </Text>
          </View>
        ) : null}

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
