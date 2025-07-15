import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggleTheme);
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
