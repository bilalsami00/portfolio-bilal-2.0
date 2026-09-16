import { ReactElement } from "react";
import { useTheme } from "./ThemeProvider";

type LightModeOnlyProps = {
  children: ReactElement;
  /** Optional fallback while theme hydrates or in dark mode */
  fallback?: ReactElement | null;
};

/**
 * Renders children only when the classic light theme is active.
 */
const LightModeOnly = ({
  children,
  fallback = null,
}: LightModeOnlyProps): ReactElement | null => {
  const { theme, isReady } = useTheme();

  if (!isReady || theme !== "light") {
    return fallback;
  }

  return children;
};

export default LightModeOnly;
