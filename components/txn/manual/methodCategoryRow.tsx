import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { makeStyles } from "./styles";
import { PickerModal } from "./pickerModal";
import { METHODS } from "@/types/money";
import { useAtomValue } from "jotai";
import { CategoriesAtom } from "@/contexts/init";

export function MethodCategoryRow(props: { theme: MaterialTheme; form: any }) {
  const { theme, form } = props;
  const styles = makeStyles(theme);
  const categories = useAtomValue(CategoriesAtom);

  const [pickMethod, setPickMethod] = React.useState(false);
  const [pickCategory, setPickCategory] = React.useState(false);

  return (
    <View style={styles.row2}>
      <form.Field name="method">
        {(field: any) => (
          <>
            <Pressable
              onPress={() => setPickMethod(true)}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                styles.pillField,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={{ color: theme.colors.onSurface, fontWeight: "700" }}
              >
                {field.state.value ?? "Card"}
              </Text>
            </Pressable>

            <PickerModal
              theme={theme}
              title="Method"
              visible={pickMethod}
              items={METHODS}
              selected={field.state.value ?? "Card"}
              onClose={() => setPickMethod(false)}
              onPick={(v) => {
                field.handleChange(v);
                setPickMethod(false);
              }}
            />
          </>
        )}
      </form.Field>

      <form.Field name="category">
        {(field: any) => (
          <>
            <Pressable
              onPress={() => setPickCategory(true)}
              android_ripple={{ color: theme.colors.ripple }}
              style={[
                styles.pillField,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <MaterialIcons
                name="local-offer"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={{ color: theme.colors.onSurface, fontWeight: "700" }}
              >
                {field.state.value ?? "Other"}
              </Text>
            </Pressable>

            <PickerModal
              theme={theme}
              title="Category"
              visible={pickCategory}
              items={categories}
              selected={field.state.value ?? "Other"}
              onClose={() => setPickCategory(false)}
              onPick={(v) => {
                field.handleChange(v);
                setPickCategory(false);
              }}
            />
          </>
        )}
      </form.Field>
    </View>
  );
}
