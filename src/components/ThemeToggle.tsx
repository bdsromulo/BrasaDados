import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const salvo = localStorage.getItem("brasadados_tema") as Theme;
      if (salvo === "dark" || salvo === "light") return salvo;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("brasadados_tema", theme);
  }, [theme]);

  return (
    <div
      role="group"
      aria-label="Alternar tema"
      className="inline-flex items-center gap-0.5 rounded-full border border-zinc-200/90 bg-zinc-100/80 p-0.5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 shadow-2xs"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        title="Modo Claro"
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "light"
            ? "bg-white text-zinc-950 shadow-xs font-bold"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        <Sun className="h-3.5 w-3.5 text-amber-500" />
        <span className="hidden sm:inline">Claro</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        title="Modo Escuro"
        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "dark"
            ? "bg-zinc-800 text-zinc-100 shadow-xs font-bold"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        }`}
      >
        <Moon className="h-3.5 w-3.5 text-blue-400" />
        <span className="hidden sm:inline">Escuro</span>
      </button>
    </div>
  );
}
