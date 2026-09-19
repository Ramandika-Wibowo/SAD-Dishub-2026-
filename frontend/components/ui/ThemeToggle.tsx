"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "pill";
}

export default function ThemeToggle({ className, variant = "icon" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-lg bg-surface-100 dark:bg-slate-800 animate-pulse", className)} />
    );
  }

  if (variant === "pill") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          "border border-surface-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm",
          "text-surface-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400",
          "transition-all duration-200 shadow-xs hover:shadow-sm",
          className
        )}
        title={theme === "light" ? "Aktifkan Mode Gelap" : "Aktifkan Mode Terang"}
      >
        {theme === "light" ? (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-600" />
            <span>Mode Gelap</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Terang</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "text-surface-500 hover:text-surface-800 hover:bg-surface-100",
        "dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/80",
        "focus:outline-none focus:ring-2 focus:ring-primary-500",
        className
      )}
      title={theme === "light" ? "Beralih ke Mode Gelap" : "Beralih ke Mode Terang"}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-slate-600 hover:text-primary-600 transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300 transition-colors" />
      )}
    </button>
  );
}
