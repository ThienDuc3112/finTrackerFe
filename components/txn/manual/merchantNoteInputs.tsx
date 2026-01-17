import React from "react";
import { TextInput } from "react-native";
import type { MaterialTheme } from "@/constants/theme";
import { makeStyles } from "./styles";

export function MerchantNoteInputs(props: { theme: MaterialTheme; form: any }) {
  const { theme, form } = props;
  const styles = makeStyles(theme);

  return (
    <>
      <form.Field name="merchant">
        {(field: any) => (
          <TextInput
            value={field.state.value ?? ""}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            placeholder="Merchant (optional)"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            style={[
              styles.blockInput,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface,
              },
            ]}
          />
        )}
      </form.Field>

      <form.Field name="note">
        {(field: any) => (
          <TextInput
            value={field.state.value ?? ""}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            placeholder="Add notes"
            placeholderTextColor={theme.colors.onSurfaceVariant}
            style={[
              styles.blockInput,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline,
                color: theme.colors.onSurface,
              },
            ]}
          />
        )}
      </form.Field>
    </>
  );
}
