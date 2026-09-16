import { ReactNode } from "react";
import { useTheme } from "./ThemeProvider";

type LightModeOnlyProps = {
  children: ReactNode;
  /** Optional fallback while theme hydrates or in dark mode */
  fallback?: ReactNode;
};

/**
 * Renders children only when the classic light theme is active.
 */
const LightModeOnly = ({ children, fallback = null }: LightModeOnlyProps) => {
  const { theme, isReady } = useTheme();

  if (!isReady || theme !== "light") {
    return fallback;
  }

  return children;
};

export default LightModeOnly;
