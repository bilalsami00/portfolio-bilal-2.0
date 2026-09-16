import { useTheme } from "./ThemeProvider";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden
  >
    <circle cx="12" cy="12" r="4" />
    <path
      strokeLinecap="round"
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z"
    />
  </svg>
);

/**
 * Switches between classic light (teal) and dark-fantasy themes.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme, isReady } = useTheme();
  const isDark = theme === "dark";

  let icon = (
    <span className="h-4 w-4 rounded-full border border-current opacity-40" />
  );
  if (isReady) {
    icon = isDark ? <SunIcon /> : <MoonIcon />;
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        inline-flex h-10 w-10 items-center justify-center
        border border-steel-700 text-parchment-200
        transition-colors duration-300
        hover:border-crimson-500/60 hover:text-parchment-100
      "
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {icon}
    </button>
  );
};

export default ThemeToggle;
