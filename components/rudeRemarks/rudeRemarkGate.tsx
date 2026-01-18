import React from "react";
import {
  ActivityIndicator,
  BackHandler,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAtom } from "jotai";
import { useTheme } from "@/hooks/use-theme";
import { RudeRemarkGateAtom } from "@/contexts/init"; // <-- adjust path if needed

export function RudeRemarkGate(): React.ReactElement {
  const theme = useTheme();
  const [gate, setGate] = useAtom(RudeRemarkGateAtom);
  const [remainingMs, setRemainingMs] = React.useState(0);

  // Tick countdown + auto close
  React.useEffect(() => {
    if (!gate.visible) return;

    const tick = () => {
      if (gate.visible && gate.phase === "showing") {
        const ms = Math.max(0, gate.lockUntil - Date.now());
        setRemainingMs(ms);
        if (ms === 0) setGate({ visible: false });
      } else {
        setRemainingMs(0);
      }
    };

    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [gate, setGate]);

  // Block Android hardware back while gate is visible
  React.useEffect(() => {
    if (!gate.visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [gate.visible]);

  const isLocked =
    gate.visible && (gate.phase === "loading" || remainingMs > 0);

  if (!gate.visible) return <></>;

  return (
    <Modal
      visible={gate.visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        // Android back / close gesture: ignore while locked
        if (!isLocked) setGate({ visible: false });
      }}
    >
      <View style={[styles.backdrop]}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
              borderRadius: theme.radius.xl,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            🧾 Financial Accountability Time
          </Text>

          {gate.phase === "loading" ? (
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <ActivityIndicator />
              <Text
                style={[
                  styles.body,
                  { color: theme.colors.onSurfaceVariant, marginTop: 10 },
                ]}
              >
                Generating a rude remark…
              </Text>
            </View>
          ) : (
            <>
              <Text style={[styles.remark, { color: theme.colors.error }]}>
                {gate.remark}
              </Text>

              <Text
                style={[
                  styles.countdown,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {remainingMs > 0
                  ? `No skipping. ${Math.ceil(remainingMs / 1000)}s`
                  : ""}
              </Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    padding: 18,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  body: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  remark: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  countdown: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
