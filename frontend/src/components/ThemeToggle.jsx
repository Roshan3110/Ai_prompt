import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-900/15 text-sm hover:border-brass-500 dark:border-vellum-100/15 dark:hover:border-brass-400"
    >
      {isDark ? "☾" : "☀"}
    </button>
  );
}
