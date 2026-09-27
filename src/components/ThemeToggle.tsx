import { useState } from "react";
import { Moon, Sun } from "lucide-react";
export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("brasadados_tema", next ? "dark" : "light");
    } catch {
      /* In-memory theme remains usable. */
    }
  }
  return (
    <button
      className="theme-toggle icon-button"
      onClick={toggle}
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      aria-pressed={dark}
    >
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
