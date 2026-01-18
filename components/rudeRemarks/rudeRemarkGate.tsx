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
import { RudeRemarkGateAtom } from "@/contexts/init";

import * as Speech from "expo-speech";
import { Audio } from "expo-av";

export function RudeRemarkGate(): React.ReactElement {
  const theme = useTheme();
  const [gate, setGate] = useAtom(RudeRemarkGateAtom);
  const [remainingMs, setRemainingMs] = React.useState(0);

  const lastSpokenTxnIdRef = React.useRef<string | null>(null);

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

  React.useEffect(() => {
    if (!(gate.visible && gate.phase === "showing")) return;

    if (lastSpokenTxnIdRef.current === gate.txnId) return;
    lastSpokenTxnIdRef.current = gate.txnId;

    let cancelled = false;

    (async () => {
      try {
        // Play through speaker, and play even when iOS silent switch is on.
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true, // lower other audio
          playThroughEarpieceAndroid: false, // speaker
        });
      } catch {
        // ignore
      }

      if (cancelled) return;

      // stop anything ongoing and SHOUT
      Speech.stop();
      Speech.speak(`HEY! ${gate.remark}`, {
        rate: 0.92, // slightly slower = more "shouty"
        pitch: 1.25, // higher pitch feels more aggressive
        language: "en-US",
      });

      // Optional extra-annoying: repeat once after a short delay
      // setTimeout(() => {
      //   Speech.stop();
      //   Speech.speak(gate.remark, { rate: 0.9, pitch: 1.2, language: "en-US" });
      // }, 1200);
    })();

    return () => {
      cancelled = true;
    };
  }, [gate.visible, (gate as any)?.phase, (gate as any)?.txnId]);

  // ✅ Stop speaking when the modal closes
  React.useEffect(() => {
    if (!gate.visible) {
      lastSpokenTxnIdRef.current = null;
      Speech.stop();
    }
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
            📢 SHAME ALERT
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
              {/* make it look like a "shout" */}
              <Text style={[styles.remark, { color: theme.colors.error }]}>
                {gate.remark?.toUpperCase()}
              </Text>

              <Text
                style={[
                  styles.countdown,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {remainingMs > 0
                  ? `NO SKIPPING. ${Math.ceil(remainingMs / 1000)}s`
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
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  body: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  remark: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0.6,
  },
  countdown: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});
