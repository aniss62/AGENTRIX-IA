// Agentrix-IA — Light/dark theme (context, hook, persistence)
const ThemeContext = React.createContext(null);

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("agentrix_theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {}
  return "dark";
}

function applyDocTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function ThemeProvider({ children }) {
  const [theme, setThemeState] = React.useState(getInitialTheme);

  React.useEffect(() => { applyDocTheme(theme); }, [theme]);

  const setTheme = React.useCallback((v) => {
    setThemeState(v);
    try { localStorage.setItem("agentrix_theme", v); } catch (e) {}
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try { localStorage.setItem("agentrix_theme", next); } catch (e) {}
      return next;
    });
  }, []);

  const value = { theme, setTheme, toggleTheme, isLight: theme === "light" };
  return React.createElement(ThemeContext.Provider, { value }, children);
}

function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

Object.assign(window, { ThemeProvider, useTheme });
