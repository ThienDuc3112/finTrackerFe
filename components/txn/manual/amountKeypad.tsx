import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { MaterialTheme } from "@/constants/theme";
import { makeStyles } from "./styles";
import { PickerModal } from "./pickerModal";
import { evalExpr } from "./utils";
import { CURRENCIES } from "@/types/money";

export function AmountKeypad(props: { theme: MaterialTheme; form: any }) {
  const { theme, form } = props;
  const styles = makeStyles(theme);

  const [pickCurrency, setPickCurrency] = React.useState(false);
  const [expr, setExpr] = React.useState("");

  const displayAmount = React.useMemo(() => {
    if (!expr) return "0";
    const v = evalExpr(expr);
    const abs = Math.abs(v);
    const s = String(abs);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
  }, [expr]);

  return (
    <View style={styles.calcWrap}>
      <form.Field
        name="amount"
        validators={{
          onChange: ({ value }: any) =>
            Number.isFinite(value) && value > 0 ? undefined : "Enter an amount",
          onSubmit: ({ value }: any) =>
            Number.isFinite(value) && value > 0 ? undefined : "Enter an amount",
        }}
      >
        {(amountField: any) => {
          const setExprAndAmount = (next: string) => {
            setExpr(next);
            const abs = Math.abs(evalExpr(next));
            amountField.handleChange(abs);
          };

          const backspace = () =>
            setExprAndAmount(expr.length ? expr.slice(0, -1) : "");
          const clear = () => setExprAndAmount("");

          const op = (o: string) => {
            const prev = expr;
            if (!prev) {
              setExprAndAmount(o === "-" ? "-" : "");
              return;
            }
            const last = prev[prev.length - 1];
            const lastIsOp =
              last === "+" || last === "-" || last === "*" || last === "/";
            setExprAndAmount(lastIsOp ? prev.slice(0, -1) + o : prev + o);
          };

          const equals = () => {
            const v = evalExpr(expr);
            if (!Number.isFinite(v)) return;
            const abs = Math.abs(v);
            setExprAndAmount(abs === 0 ? "" : String(abs));
          };

          const amountErr = amountField.state.meta.errors?.[0];

          return (
            <>
              <View
                style={[
                  styles.amountBox,
                  {
                    borderColor: theme.colors.outline,
                    backgroundColor: theme.colors.surface,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <form.Field
                    name="currency"
                    validators={{
                      onChange: ({ value }: any) =>
                        value ? undefined : "Pick a currency",
                      onSubmit: ({ value }: any) =>
                        value ? undefined : "Pick a currency",
                    }}
                  >
                    {(currencyField: any) => (
                      <>
                        <Pressable
                          onPress={() => setPickCurrency(true)}
                          android_ripple={{ color: theme.colors.ripple }}
                          style={[
                            styles.currencyChip,
                            {
                              backgroundColor: theme.colors.surfaceVariant,
                              borderColor: theme.colors.outline,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: theme.colors.onSurfaceVariant,
                              fontWeight: "800",
                            }}
                          >
                            {currencyField.state.value ?? "SGD"}
                          </Text>
                          <MaterialIcons
                            name="expand-more"
                            size={18}
                            color={theme.colors.onSurfaceVariant}
                          />
                        </Pressable>

                        <PickerModal
                          theme={theme}
                          title="Currency"
                          visible={pickCurrency}
                          items={CURRENCIES}
                          selected={currencyField.state.value ?? "SGD"}
                          onClose={() => setPickCurrency(false)}
                          onPick={(v) => {
                            currencyField.handleChange(v);
                            setPickCurrency(false);
                          }}
                        />
                      </>
                    )}
                  </form.Field>

                  <Pressable
                    onLongPress={clear}
                    onPress={backspace}
                    hitSlop={10}
                    style={styles.iconBtn}
                  >
                    <MaterialIcons
                      name="backspace"
                      size={22}
                      color={theme.colors.onSurfaceVariant}
                    />
                  </Pressable>
                </View>

                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={[
                    styles.amountText,
                    {
                      color: theme.colors.onSurface,
                      fontFamily: theme.fonts.rounded,
                    },
                  ]}
                >
                  {displayAmount}
                </Text>

                {amountErr ? (
                  <Text
                    style={{
                      color: theme.colors.error,
                      fontSize: 12,
                      fontWeight: "800",
                    }}
                  >
                    {amountErr}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      fontSize: 12,
                    }}
                  >
                    Tap date to edit
                  </Text>
                )}
              </View>

              <View
                style={[styles.keypad, { borderColor: theme.colors.outline }]}
              >
                {[
                  ["+", "7", "8", "9"],
                  ["-", "4", "5", "6"],
                  ["*", "1", "2", "3"],
                  ["/", "0", ".", "="],
                ].map((row, rIdx) => (
                  <View key={rIdx} style={styles.keyRow}>
                    {row.map((k, cIdx) => {
                      const isOpCol = cIdx === 0;
                      const isEquals = k === "=";

                      const bg = isEquals
                        ? theme.colors.primaryContainer
                        : isOpCol
                          ? theme.colors.surfaceVariant
                          : theme.colors.surface;

                      const fg = isEquals
                        ? theme.colors.onPrimaryContainer
                        : isOpCol
                          ? theme.colors.onSurfaceVariant
                          : theme.colors.onSurface;

                      const onPress = () => {
                        if (k === "=") return equals();
                        if (k === ".") return setExprAndAmount(expr + ".");
                        if (k === "+" || k === "-" || k === "*" || k === "/")
                          return op(k);
                        return setExprAndAmount(expr === "0" ? k : expr + k);
                      };

                      return (
                        <Pressable
                          key={`${rIdx}-${k}`}
                          onPress={onPress}
                          android_ripple={{ color: theme.colors.ripple }}
                          style={[
                            styles.key,
                            {
                              backgroundColor: bg,
                              borderColor: theme.colors.outline,
                              borderTopWidth:
                                rIdx === 0 ? 0 : StyleSheet.hairlineWidth,
                              borderLeftWidth:
                                cIdx === 0 ? 0 : StyleSheet.hairlineWidth,
                            },
                            isEquals && {
                              borderBottomRightRadius: theme.radius.lg,
                            },
                            rIdx === 3 &&
                              cIdx === 0 && {
                                borderBottomLeftRadius: theme.radius.lg,
                              },
                          ]}
                        >
                          <Text
                            style={{
                              color: fg,
                              fontWeight: "800",
                              fontSize: 22,
                            }}
                          >
                            {k === "*" ? "×" : k === "/" ? "÷" : k}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                ))}
              </View>
            </>
          );
        }}
      </form.Field>
    </View>
  );
}
