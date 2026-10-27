"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  Cloud,
  MapPin,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero: React.FC = () => {
  return (
    <section id="hero" className="pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="container mx-auto">
        {/* Asymmetric 12-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* CELL 1: Main Identity & Value Proposition (8 cols) */}
          <div className="lg:col-span-8 bento-card bento-card-hover p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              {/* Top Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>SDE II at Amazon · Backend &amp; Distributed Systems</span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Seattle, WA</span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.08] mb-5">
                Keerthan Nandigama
                <span className="block text-xl sm:text-2xl md:text-3xl font-semibold text-slate-600 dark:text-slate-300 mt-3 leading-snug">
                  Software Development Engineer II building{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    scalable backend systems on AWS
                  </span>{" "}
                  and customer-focused products.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8">
                At{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Amazon
                </strong>
                , I architect and ship backend services into production using
                AWS and internal cloud tooling to deliver direct value to
                customers. Backed by{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  5+ years of industry experience
                </strong>{" "}
                across{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Amazon, CARS24, and NeoGrowth
                </strong>
                , an M.S. in Computer Engineering from{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  Stony Brook University
                </strong>
                , and a B.Tech in CSE from{" "}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">
                  NIT Durgapur
                </strong>
                .
              </p>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-sm shadow-blue-600/20 transition-all"
              >
                <span>Get in Touch</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://docs.google.com/document/d/16IA_B_VPAjWNEaUJ3oq2SvG7gOAkZznUMn6qKbL9O94/edit?tab=t.0"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900 hover:border-blue-500/50 text-slate-900 dark:text-slate-100 font-semibold text-sm transition-all"
              >
                <span>Resume &amp; Portfolio</span>
                <ArrowUpRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </a>

              <Link
                href="/3d"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 hover:from-blue-600/20 hover:to-violet-600/20 text-blue-600 dark:text-blue-400 font-semibold text-sm transition-all shadow-sm group"
                title="Explore portfolio in an interactive Three.js 3D Universe"
              >
                <Sparkles className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
                <span>3D Experience</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/20 font-bold">
                  3js
                </span>
              </Link>

              <a
                href="#experience"
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
              >
                <span>View Experience</span>
              </a>

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href="https://www.linkedin.com/in/keerthan-nandigama-b3b19b175/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a
                  href="https://github.com/zoro8048"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all"
                  aria-label="GitHub"
                  title="GitHub (@zoro8048)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* CELL 2: Current Role Spotlight Card (4 cols) */}
          <div className="lg:col-span-4 bento-card bento-card-hover p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/80 dark:from-[#161b28] dark:to-[#121620]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  Current Role
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  1 yr 5 mos
                </span>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 flex items-center justify-center">
                  <img
                    src="https://i.postimg.cc/fRTkHZx2/01cada77a0a7d326d85b7969fe26a728.jpg"
                    alt="Amazon logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "/images/placeholder-logo.svg";
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Amazon · Seattle, WA
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">
                    Software Dev Engineer II
                  </h2>
                  <div className="text-xs text-slate-500 mt-1">
                    Jun 2025 - Present
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                Building and operating backend systems on AWS and internal
                infrastructure, shipping reliable production software that adds
                direct value to customers.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Day-to-Day Focus
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "AWS",
                  "Backend Systems",
                  "Java",
                  "TypeScript",
                  "Distributed Services",
                  "CI/CD & Tooling",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CELL 3: Cloud & Backend Engineering Bento Card (4 cols) */}
          <div className="lg:col-span-4 bento-card bento-card-hover p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Cloud &amp; Backend Focus
                </span>
                <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                AWS at Scale
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Shipping high-availability backend services at{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  Amazon
                </strong>{" "}
                from system design through production telemetry.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  Cloud Services
                </div>
                <div className="text-slate-500 text-[11px]">AWS &amp; Internal Tools</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  Production Rigor
                </div>
                <div className="text-slate-500 text-[11px]">CI/CD &amp; Reliability</div>
              </div>
            </div>
          </div>

          {/* CELL 4: Performance Impact Bento Card (4 cols) */}
          <div className="lg:col-span-4 bento-card bento-card-hover p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Performance &amp; Scale
                </span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                ~40% Faster
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Optimized a business-critical workflow at{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  CARS24
                </strong>{" "}
                and scaled a unified platform across{" "}
                <strong className="text-slate-900 dark:text-slate-100">
                  4 countries
                </strong>
                .
              </p>
            </div>

            {/* Visual Before/After Bar */}
            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-blue-600 dark:text-blue-400 font-semibold mb-1">
                  <span>Critical Path Latency</span>
                  <span className="font-mono">-40% Reduction</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full w-[60%] bg-blue-600 dark:bg-blue-400 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Multi-Region Rollout</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                  IN · UAE · ID · TH
                </span>
              </div>
            </div>
          </div>

          {/* CELL 5: Recognition Bento Card (4 cols) */}
          <div className="lg:col-span-4 bento-card bento-card-hover p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Track Record
                </span>
                <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                5+ Yrs · 4x Awards
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Consistent top performer across backend, web, and mobile
                engineering.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  Innovator &amp; Best Coder
                </div>
                <div className="text-slate-500 text-[11px]">CARS24 · 2x Winner</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-amber-600 dark:text-amber-400 font-semibold">
                  Rookie &amp; EOTM
                </div>
                <div className="text-slate-500 text-[11px]">CARS24 &amp; NeoGrowth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
