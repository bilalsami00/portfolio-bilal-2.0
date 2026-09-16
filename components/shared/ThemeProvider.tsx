import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type PortfolioTheme = "light" | "dark";

type ThemeContextValue = {
  theme: PortfolioTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: PortfolioTheme) => void;
  isReady: boolean;
};

const STORAGE_KEY = "portfolio-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyThemeToDocument = (theme: PortfolioTheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.style.colorScheme = theme;
};

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Light = classic teal light theme.
 * Dark = current dark-fantasy theme.
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<PortfolioTheme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let initial: PortfolioTheme = "dark";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") {
        initial = stored;
      }
    } catch {
      // Ignore storage access errors (private mode, etc.)
    }

    setThemeState(initial);
    applyThemeToDocument(initial);
    setIsReady(true);
  }, []);

  const setTheme = useCallback((next: PortfolioTheme) => {
    setThemeState(next);
    applyThemeToDocument(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
      isReady,
    }),
    [theme, toggleTheme, setTheme, isReady]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
