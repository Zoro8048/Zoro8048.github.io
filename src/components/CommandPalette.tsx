"use client";

import {
  ArrowUpRight,
  Award,
  Briefcase,
  Code2,
  FileText,
  GraduationCap,
  MessageSquare,
  Search,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface CommandItem {
  id: string;
  label: string;
  sublabel: string;
  category: "Recruiter Actions" | "Navigate";
  icon: React.ElementType;
  href: string;
  external?: boolean;
}

const commands: CommandItem[] = [
  {
    id: "resume",
    label: "Open Resume & Case Studies Doc",
    sublabel: "Google Docs · Detailed project & architecture breakdown",
    category: "Recruiter Actions",
    icon: FileText,
    href: "https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0",
    external: true,
  },
  {
    id: "linkedin",
    label: "Connect on LinkedIn",
    sublabel: "linkedin.com/in/keerthan-nandigama-b3b19b175",
    category: "Recruiter Actions",
    icon: ArrowUpRight,
    href: "https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/",
    external: true,
  },
  {
    id: "github",
    label: "View GitHub Profile (@zoro8048)",
    sublabel: "github.com/zoro8048 · Open source & repositories",
    category: "Recruiter Actions",
    icon: Code2,
    href: "https://github.com/zoro8048",
    external: true,
  },
  {
    id: "contact",
    label: "Send Direct Message",
    sublabel: "Jump to embedded contact form",
    category: "Recruiter Actions",
    icon: MessageSquare,
    href: "#contact",
  },
  {
    id: "exp",
    label: "Experience Ledger (Amazon, CARS24, NeoGrowth)",
    sublabel: "5+ years production software engineering",
    category: "Navigate",
    icon: Briefcase,
    href: "#experience",
  },
  {
    id: "awards",
    label: "Engineering Impact & 4x Awards",
    sublabel: "-40% latency, 4 international markets, EOTM",
    category: "Navigate",
    icon: Award,
    href: "#achievements",
  },
  {
    id: "skills",
    label: "Tech Radar & Stack Matrix",
    sublabel: "TypeScript, Java, AWS, React Native, Swift, Next.js",
    category: "Navigate",
    icon: Code2,
    href: "#skills",
  },
  {
    id: "about",
    label: "Engineering Philosophy & Bio",
    sublabel: "System design, mobile & full-stack execution",
    category: "Navigate",
    icon: User,
    href: "#about",
  },
  {
    id: "edu",
    label: "Education (Stony Brook MS & NIT Durgapur B.Tech)",
    sublabel: "Computer Engineering & Computer Science",
    category: "Navigate",
    icon: GraduationCap,
    href: "#education",
  },
];

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const onOpenCustom = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onOpenCustom);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onOpenCustom);
    };
  }, []);

  if (!open) return null;

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.sublabel.toLowerCase().includes(query.toLowerCase())
  );

  const handleClose = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#121620] border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sections or links (e.g. 'Amazon', 'Resume', 'AWS')..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={handleClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close command menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching results found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={handleClose}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-500/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 shrink-0">
                    {item.external ? "Open ↗" : "Jump ↵"}
                  </span>
                </a>
              );
            })
          )}
        </div>

        {/* Footer bar */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Quick Navigation</span>
          <span className="font-mono text-[11px]">ESC to close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
