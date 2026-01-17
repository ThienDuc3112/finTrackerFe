import { useMemo } from "react";
import {
  getMaterialTheme,
  type MaterialTheme,
  type AppColorScheme,
} from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const useTheme = (): MaterialTheme => {
  const scheme = (useColorScheme() ?? "light") as AppColorScheme;
  return useMemo(() => getMaterialTheme(scheme), [scheme]);
};
