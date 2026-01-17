import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { MaterialTheme } from "@/constants/theme";
import { makeStyles } from "./styles";
import { fmtHeader } from "./utils";
import { DateTimeModal } from "./dateTimeModal";

export function TopBar(props: {
  theme: MaterialTheme;
  // tanstack form instance (typed in your screen)
  form: any;
}) {
  const { theme, form } = props;
  const styles = makeStyles(theme);

  const [pickDate, setPickDate] = React.useState(false);

  return (
    <>
      <View
        style={[styles.topBar, { borderBottomColor: theme.colors.divider }]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.iconBtn}
        >
          <MaterialIcons
            name="close"
            size={22}
            color={theme.colors.onSurfaceVariant}
          />
        </Pressable>

        <Pressable
          onPress={() => setPickDate(true)}
          style={styles.topTitleWrap}
        >
          <form.Subscribe selector={(s: any) => s.values.occurredAt}>
            {(occurredAt: Date) => (
              <Text
                style={[styles.topTitle, { color: theme.colors.onSurface }]}
              >
                {fmtHeader(occurredAt ?? new Date())}
              </Text>
            )}
          </form.Subscribe>
        </Pressable>

        <form.Subscribe selector={(s: any) => s.canSubmit}>
          {(canSubmit: boolean) => (
            <Pressable
              onPress={() => void form.handleSubmit()}
              hitSlop={12}
              style={styles.iconBtn}
              disabled={!canSubmit}
            >
              <MaterialIcons
                name="check"
                size={22}
                color={
                  canSubmit
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
            </Pressable>
          )}
        </form.Subscribe>
      </View>

      <form.Field
        name="occurredAt"
        validators={{
          onChange: ({ value }: any) =>
            value instanceof Date && !Number.isNaN(value.getTime())
              ? undefined
              : "Invalid date",
          onSubmit: ({ value }: any) =>
            value instanceof Date && !Number.isNaN(value.getTime())
              ? undefined
              : "Invalid date",
        }}
      >
        {(field: any) => (
          <DateTimeModal
            theme={theme}
            visible={pickDate}
            value={field.state.value ?? new Date()}
            onClose={() => setPickDate(false)}
            onSave={(d) => {
              field.handleChange(d);
              setPickDate(false);
            }}
          />
        )}
      </form.Field>
    </>
  );
}
