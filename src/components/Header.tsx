"use client";

import { ArrowUpRight, Command, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Impact & Awards", href: "#achievements" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(new Event("open-command-palette"));
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 px-4 pointer-events-none"
      style={{
        paddingTop: "max(0.75rem, calc(0.5rem + env(safe-area-inset-top, 0px)))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="container mx-auto">
        <div
          className={`pointer-events-auto flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-300 border ${
            scrolled
              ? "bg-white/90 dark:bg-[#121620]/90 backdrop-blur-xl border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-slate-900/5 dark:shadow-black/40"
              : "bg-white/80 dark:bg-[#121620]/80 backdrop-blur-md border-slate-200/70 dark:border-slate-800/70"
          }`}
        >
          {/* Left: Brand Identity */}
          <a
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center tracking-tight group-hover:bg-blue-500 transition-colors shadow-sm shadow-blue-600/20">
              KN
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">
                  Keerthan Nandigama
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  SDE II at Amazon
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Seattle, WA · MS at Stony Brook
              </span>
            </div>
          </a>

          {/* Center: Clean Recruiter-Friendly Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: Subtle Command Palette Trigger + Resume + CTA + Theme */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={openCommandPalette}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 hover:border-blue-500/40 hover:text-slate-900 dark:hover:text-slate-200 transition-all"
              title="Open Quick Navigation (⌘K)"
            >
              <Command className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <kbd className="font-mono text-[11px]">⌘K</kbd>
            </button>

            <a
              href="https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-700 transition-all"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/20 transition-colors"
            >
              Get in Touch
            </a>

            <ThemeToggle />
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={openCommandPalette}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              aria-label="Open quick navigation"
            >
              <Command size={16} />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="pointer-events-auto lg:hidden mt-2 rounded-2xl bg-white/95 dark:bg-[#121620]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
                <a
                  href="https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  <span>Resume Doc</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
