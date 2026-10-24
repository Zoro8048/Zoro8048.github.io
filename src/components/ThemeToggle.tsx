"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "kn_theme_2026";

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem(STORAGE_KEY);
      const useDarkMode = savedTheme ? savedTheme === "dark" : true;

      setDarkMode(useDarkMode);
      document.documentElement.classList.toggle("dark", useDarkMode);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem(STORAGE_KEY, "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem(STORAGE_KEY, "dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
      aria-label="Toggle color theme"
      title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default ThemeToggle;
