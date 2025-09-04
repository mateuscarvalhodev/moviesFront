import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "@/utils/theme";
import type { Theme } from "@/utils/theme";
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      className="rounded-lg px-3 py-2 bg-brand text-white"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
