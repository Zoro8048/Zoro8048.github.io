import { ArrowUp, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      className="pt-10 pb-10 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-[#0b0d13]"
      style={{
        paddingBottom: "max(2.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
        paddingLeft: "max(1rem, env(safe-area-inset-left, 0px))",
        paddingRight: "max(1rem, env(safe-area-inset-right, 0px))",
      }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              KN
            </span>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className="text-slate-900 dark:text-slate-100 font-semibold">
                Keerthan Nandigama
              </span>{" "}
              · SDE II at Amazon · Seattle, WA
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <a
              href="https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/zoro8048"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Resume Doc
            </a>
            <Link
              href="/3d"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Universe</span>
            </Link>
            <a
              href="#hero"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-blue-500/50 transition-all"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
