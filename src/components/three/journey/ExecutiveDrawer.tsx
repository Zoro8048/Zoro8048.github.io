"use client";

import React from "react";
import {
  X,
  MapPin,
  FileText,
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  Code2,
} from "lucide-react";
import { JOURNEY_ZONES } from "./zonesData";
import { journeyAudio } from "./journeyAudio";

interface ExecutiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onWarpToZone: (zoneId: string) => void;
  currentZoneId: string;
}

export const ExecutiveDrawer: React.FC<ExecutiveDrawerProps> = ({
  isOpen,
  onClose,
  onWarpToZone,
  currentZoneId,
}) => {
  if (!isOpen) return null;

  const handleWarp = (zoneId: string) => {
    journeyAudio.playMechanicalClick();
    onWarpToZone(zoneId);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex justify-end">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Editorial Panel */}
      <div className="relative w-full max-w-xl h-full bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden z-10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        {/* Top Hairline Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* 1. DRAWER HEADER */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/50">
                EXECUTIVE SUMMARY // FAST TRACK
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Keerthan</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Software Development Engineer II @ <span className="text-amber-400 font-semibold">Amazon AWS</span>
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Seattle, WA
              </span>
              <span>·</span>
              <span>Full-Stack &amp; Distributed Systems</span>
            </div>
          </div>

          <button
            onClick={() => {
              journeyAudio.playMechanicalClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Drawer [Esc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. SCROLLABLE RESUME & METRICS BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
          {/* Executive Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 rounded-2xl p-3 border border-white/5 flex flex-col">
              <span className="text-xl font-black text-emerald-400 tracking-tight">-40%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Latency Speedup
              </span>
              <span className="text-[9px] text-slate-500 mt-1">CARS24 Core APIs</span>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-3 border border-white/5 flex flex-col">
              <span className="text-xl font-black text-amber-400 tracking-tight">AWS SDE II</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Tier-1 Services
              </span>
              <span className="text-[9px] text-slate-500 mt-1">Amazon Cloud</span>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-3 border border-white/5 flex flex-col">
              <span className="text-xl font-black text-blue-400 tracking-tight">3x + EOTM</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                Tech Excellence
              </span>
              <span className="text-[9px] text-slate-500 mt-1">Award Recognition</span>
            </div>
          </div>

          {/* Direct 3D Circuit Warp Directory */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/50 mb-3 flex items-center justify-between">
              <span>CAREER STATIONS // CLICK TO WARP 3D SCENE</span>
              <span className="text-[9px] text-slate-500">7 DISTRICTS</span>
            </div>

            <div className="space-y-2">
              {JOURNEY_ZONES.map((zone, idx) => {
                const isCurrent = currentZoneId === zone.id;
                return (
                  <div
                    key={zone.id}
                    onClick={() => handleWarp(zone.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isCurrent
                        ? "bg-slate-900/90 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        : "bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold"
                        style={{
                          backgroundColor: `${zone.color}20`,
                          color: zone.color,
                          border: `1px solid ${zone.color}40`,
                        }}
                      >
                        0{idx}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                          {zone.name}
                          {isCurrent && (
                            <span className="text-[9px] text-blue-400 font-mono font-normal">
                              [CURRENT]
                            </span>
                          )}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {zone.role || zone.tagline}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-400 transition-colors">
                      <span className="text-[10px] font-mono hidden sm:inline">Drive Here</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Technical Arsenal */}
          <div>
            <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/50 mb-3 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>CORE TECHNICAL ARSENAL</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Distributed Systems",
                "Amazon AWS",
                "Java",
                "TypeScript",
                "Python",
                "React / Next.js",
                "Spring Boot",
                "Microservices",
                "Docker / Kubernetes",
                "High-Throughput APIs",
                "Swift",
                "Kotlin",
                "SQL / NoSQL",
                "CI/CD Pipelines",
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 text-[11px] font-mono text-slate-300 border border-white/5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. DRAWER FOOTER: DIRECT RESUME DOWNLOAD & EXTERNAL LINKS */}
        <div className="p-5 border-t border-white/10 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/zoro8048"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/keerthan-g-956891147/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:keerthang8048@gmail.com"
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors"
              title="Send Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Download Official Resume</span>
          </a>
        </div>
      </div>
    </div>
  );
};
