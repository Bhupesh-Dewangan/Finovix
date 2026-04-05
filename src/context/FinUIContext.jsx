import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";

const FinUIContext = createContext(null);

const ROLE_STORAGE_KEY = "finsight_role";
const THEME_STORAGE_KEY = "finsight_theme";

function getInitialRole() {
  if (typeof window === "undefined") return "viewer";
  const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
  return savedRole === "admin" ? "admin" : "viewer";
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function FinUIProvider({ children }) {
  const [role, setRole] = useState(getInitialRole);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  }, [role]);

  useLayoutEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      role,
      setRole,
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [role, theme],
  );

  return <FinUIContext.Provider value={value}>{children}</FinUIContext.Provider>;
}

export function useFinUI() {
  const ctx = useContext(FinUIContext);
  if (!ctx) {
    throw new Error("useFinUI must be used within a FinUIProvider");
  }
  return ctx;
}

