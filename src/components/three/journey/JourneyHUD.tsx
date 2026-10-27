"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Gauge,
  Briefcase,
  Calendar,
  MapPin,
  Award,
  Code2,
  ArrowUp,
  ArrowDown,
  Compass,
  Play,
  Pause,
  ExternalLink,
  Camera,
  Eye,
  EyeOff,
  HelpCircle,
  X,
  Zap,
  Trophy,
  Pin,
  PinOff,
  Radio,
  FileText,
  Moon,
  Sun,
  Timer,
  Megaphone,
} from "lucide-react";
import {
  JourneyZone,
  VehicleControlState,
  Telemetry,
  CameraMode,
  LapTimerData,
} from "./types";
import { JOURNEY_ZONES, MILESTONES } from "./zonesData";
import { journeyAudio } from "./journeyAudio";
import { ExecutiveDrawer } from "./ExecutiveDrawer";

interface JourneyHUDProps {
  currentZone: JourneyZone;
  speedMph: number;
  telemetry: Telemetry;
  unlockedZoneIds: string[];
  isAutoPilot: boolean;
  onToggleAutoPilot: () => void;
  onWarpToZone: (zoneId: string) => void;
  onUpdateExternalControls: (controls: VehicleControlState) => void;
  cameraMode: CameraMode;
  onCycleCameraMode: () => void;
  hudVisible: boolean;
  onToggleHud: () => void;
  isNightMode?: boolean;
  onToggleNightMode?: () => void;
  onTriggerHorn?: () => void;
  lapData?: LapTimerData | null;
}

function formatTime(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  const hundredths = Math.floor((ms % 1000) / 10);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
}

export const JourneyHUD: React.FC<JourneyHUDProps> = ({
  currentZone,
  speedMph,
  telemetry,
  unlockedZoneIds,
  isAutoPilot,
  onToggleAutoPilot,
  onWarpToZone,
  onUpdateExternalControls,
  cameraMode,
  onCycleCameraMode,
  hudVisible,
  onToggleHud,
  isNightMode = false,
  onToggleNightMode,
  onTriggerHorn,
  lapData,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [dossierExpanded, setDossierExpanded] = useState(true);
  const [isDossierPinned, setIsDossierPinned] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<{ [key: string]: boolean }>({});
  const [discoveryToast, setDiscoveryToast] = useState<{
    zone: JourneyZone;
    visible: boolean;
  } | null>(null);

  // Track physical keyboard presses in real time to illuminate the on-screen mechanical keycaps
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      setPressedKeys((prev) => (prev[k] ? prev : { ...prev, [k]: true }));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      setPressedKeys((prev) => {
        if (!prev[k]) return prev;
        const next = { ...prev };
        delete next[k];
        return next;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Toggle synthesized engine & sound FX
  const handleToggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      journeyAudio.setEnabled(next);
      return next;
    });
  }, []);

  // Auto-collapse dossier card when driving fast to keep the road clear (unless user pinned it)
  useEffect(() => {
    if (!isDossierPinned && speedMph > 14) {
      const timer = setTimeout(() => setDossierExpanded(false), 0);
      return () => clearTimeout(timer);
    }
  }, [speedMph, isDossierPinned]);

  // Auto-expand dossier when arriving at a new milestone
  useEffect(() => {
    const timer = setTimeout(() => setDossierExpanded(true), 0);
    return () => clearTimeout(timer);
  }, [currentZone.id]);

  // Show milestone discovery toast when entering a milestone zone
  useEffect(() => {
    if (!currentZone.milestone) return;

    const showTimer = setTimeout(() => {
      setDiscoveryToast({ zone: currentZone, visible: true });
    }, 10);

    const hideTimer = setTimeout(() => {
      setDiscoveryToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 4500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [currentZone]);

  // Mobile Touch control handlers
  const setControl = (key: keyof VehicleControlState, val: boolean) => {
    onUpdateExternalControls({
      forward: key === "forward" ? val : false,
      backward: key === "backward" ? val : false,
      left: key === "left" ? val : false,
      right: key === "right" ? val : false,
      brake: key === "brake" ? val : false,
    });
  };

  const unlockedCount = unlockedZoneIds.length;
  const totalMilestones = MILESTONES.length;
  const progressPercent = Math.round((unlockedCount / totalMilestones) * 100);

  // Compute realistic dynamic transmission gear
  const getGear = () => {
    if (telemetry.boosting) return "BOOST";
    if (speedMph < 0.5) return "N";
    if (speedMph > 30) return "D3";
    if (speedMph > 16) return "D2";
    return "D1";
  };

  // Zen Mode: If HUD is hidden, only show the floating sleek unhide pill
  if (!hudVisible) {
    return (
      <div className="absolute top-5 right-5 pointer-events-auto z-40 animate-fade-in">
        <button
          onClick={onToggleHud}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:scale-105 transition-all text-xs font-semibold"
          title="Restore HUD Overlay [H]"
        >
          <Eye className="w-4 h-4 text-blue-400" />
          <span>Show UI</span>
          <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-300">H</kbd>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
      {/* 0. DISCOVERY CELEBRATION TOAST */}
      {discoveryToast?.visible && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto z-50 transition-all duration-500 ease-out">
          <div
            className="flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border shadow-[0_16px_40px_rgba(0,0,0,0.8)] relative overflow-hidden"
            style={{
              borderColor: `${discoveryToast.zone.color}66`,
              boxShadow: `0 0 30px ${discoveryToast.zone.color}33`,
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${discoveryToast.zone.color}, transparent)`,
              }}
            />
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
              style={{ backgroundColor: `${discoveryToast.zone.color}25` }}
            >
              <Trophy className="w-4 h-4" style={{ color: discoveryToast.zone.color }} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Milestone Discovered · +100 XP
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {unlockedCount}/{totalMilestones}
                </span>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                {discoveryToast.zone.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER BAR */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* Left: Classic link & Milestone Progress Island */}
        <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-2xl border border-white/10 rounded-2xl px-3.5 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors group"
            title="Return to standard portfolio view"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Classic Portfolio</span>
            <span className="sm:hidden">Classic</span>
          </Link>

          <div className="h-4 w-px bg-slate-700/60" />

          {/* Progress pill & Station Status */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping absolute opacity-75"
                style={{ backgroundColor: currentZone.color }}
              />
              <span
                className="w-2.5 h-2.5 rounded-full relative"
                style={{ backgroundColor: currentZone.color }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                {currentZone.shortName}
                <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 hidden md:inline">
                  {progressPercent}% Complete
                </span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[200px]">
                {currentZone.tagline}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Instrument Cluster & Controls */}
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 px-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Executive Fast-Track Drawer Trigger */}
          <button
            onClick={() => {
              journeyAudio.playMechanicalClick();
              setIsDrawerOpen(true);
            }}
            onMouseEnter={() => journeyAudio.playHoverTick()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 hover:border-blue-400/50 transition-all shadow-md group"
            title="Open Executive Summary & Fast-Track Resume Drawer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline">Executive Summary</span>
            <span className="md:hidden">Resume</span>
          </button>

          <div className="h-4 w-px bg-slate-700/60 hidden sm:block" />

          {/* Luxury Sports Speedometer & Tachometer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border font-mono transition-all shadow-inner ${
              telemetry.boosting
                ? "border-emerald-500 shadow-emerald-500/25 ring-1 ring-emerald-400"
                : "border-slate-800"
            }`}
          >
            {/* Circular Gauge Arc */}
            <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={telemetry.boosting ? "#34d399" : "#38bdf8"}
                  strokeWidth="3.5"
                  strokeDasharray="88"
                  strokeDashoffset={Math.max(0, 88 - (88 * Math.min(1, speedMph / 85)))}
                  strokeLinecap="round"
                />
              </svg>
              <Gauge className="w-2.5 h-2.5 text-blue-400 absolute" />
            </div>

            {/* Gear indicator */}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700/60 hidden sm:inline">
              {getGear()}
            </span>

            {/* Speed readout */}
            <span className="text-sm font-black tracking-tight text-white">{speedMph}</span>
            <span className="text-[9px] text-slate-400 font-normal">MPH</span>

            {telemetry.boosting && (
              <span className="text-[10px] font-bold text-emerald-400 animate-pulse ml-0.5 flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-emerald-400" />
                TURBO
              </span>
            )}
          </div>

          {/* Autopilot Cruise Toggle */}
          <button
            onClick={onToggleAutoPilot}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isAutoPilot
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-400"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
            title="Auto-cruise along the road track [P]"
          >
            {isAutoPilot ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{isAutoPilot ? "Cruising" : "Autopilot"}</span>
          </button>

          {/* Camera View Switcher */}
          <button
            onClick={onCycleCameraMode}
            className="p-2 px-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 border border-white/5"
            title={`Camera: ${cameraMode} (Click or press C to change)`}
          >
            <Camera className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] uppercase font-mono hidden xl:inline">
              {cameraMode === "isometric" ? "Iso" : cameraMode === "close" ? "Action" : "Drone"}
            </span>
          </button>

          {/* Minimap Toggle */}
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`p-2 rounded-xl text-xs transition-colors ${
              showMinimap
                ? "bg-white/10 text-blue-400"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            title="Toggle Minimap"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Cyberpunk / Night Mode Toggle */}
          <button
            onClick={() => {
              journeyAudio.playMechanicalClick();
              onToggleNightMode?.();
            }}
            onMouseEnter={() => journeyAudio.playHoverTick()}
            className={`px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
              isNightMode
                ? "bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            title={`Toggle Cyberpunk Midnight Mode [N] (Currently ${isNightMode ? "Midnight Neon" : "Daylight Studio"})`}
          >
            {isNightMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span className="text-[10px] hidden xl:inline font-mono font-semibold">
              {isNightMode ? "Neon" : "Day"}
            </span>
          </button>

          {/* Acoustic Horn Blast & High Beam Flash */}
          <button
            onClick={() => {
              onTriggerHorn?.();
            }}
            onMouseEnter={() => journeyAudio.playHoverTick()}
            className="p-2 rounded-xl text-xs text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors flex items-center"
            title="Honk Dual Horn & Flash High Beams [H]"
          >
            <Megaphone className="w-4 h-4" />
          </button>

          {/* Sound Toggle with Live Equalizer Animation */}
          <button
            onClick={handleToggleSound}
            className={`px-2.5 py-1.5 rounded-xl text-xs transition-all relative flex items-center gap-1.5 ${
              soundEnabled
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            title={soundEnabled ? "Mute Engine Audio" : "Enable Spatial Engine Sound FX"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-emerald-400 h-2 animate-pulse" />
                  <span className="w-0.5 bg-emerald-400 h-3 animate-pulse" style={{ animationDelay: "150ms" }} />
                  <span className="w-0.5 bg-emerald-400 h-1.5 animate-pulse" style={{ animationDelay: "300ms" }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-[10px] hidden sm:inline text-slate-400">Audio</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              </>
            )}
          </button>

          {/* Reset Car [R] */}
          <button
            onClick={() => onWarpToZone(currentZone.id)}
            className="p-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Reset / Unflip Car to Road [R]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Controls Guide Modal [?] */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Driving Guide & Secrets [?]"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Zen Hide HUD [Z] */}
          <button
            onClick={onToggleHud}
            className="p-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
            title="Hide HUD for Cinematic Driving [Z]"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1.1 CIRCUIT TIME-TRIAL LAP TIMER CARD */}
      {lapData?.isActive && (
        <div
          className={`absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 pointer-events-auto z-40 transition-all duration-500 ${
            speedMph > 20 ? "opacity-35 hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.7)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="flex items-center gap-2.5">
              <Timer
                className={`w-4 h-4 ${lapData.running ? "text-cyan-400 animate-spin" : "text-slate-400"}`}
                style={{ animationDuration: "3s" }}
              />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 tracking-wider">
                  {lapData.running ? `Sector ${lapData.currentSector}/4` : "Circuit Lap"}
                </span>
                <span className="text-sm font-black font-mono tracking-tight text-white">
                  {formatTime(lapData.elapsedMs)}
                </span>
              </div>
            </div>

            {lapData.bestLapMs !== null && (
              <>
                <div className="h-6 w-px bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                    Best Lap
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {formatTime(lapData.bestLapMs)}
                  </span>
                </div>
              </>
            )}

            {lapData.deltaToBestMs !== null && (
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  lapData.deltaToBestMs < 0
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                }`}
              >
                {lapData.deltaToBestMs < 0 ? "-" : "+"}
                {(Math.abs(lapData.deltaToBestMs) / 1000).toFixed(2)}s
              </span>
            )}
          </div>
        </div>
      )}

      {/* 1.2 CELEBRATORY LAP BANNER TOAST */}
      {lapData?.lapBanner && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 pointer-events-none z-50 animate-bounce">
          <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.6)]">
            {lapData.lapBanner}
          </div>
        </div>
      )}

      {/* 2. HOLOGRAPHIC MINIMAP RADAR (TOP LEFT / UNDER HEADER) */}
      {showMinimap && (
        <div
          className={`absolute top-16 sm:top-20 left-3 sm:left-5 w-48 h-48 pointer-events-auto bg-slate-950/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden transition-all duration-500 ${
            speedMph > 14 ? "opacity-30 hover:opacity-100" : "opacity-100"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header readout */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
            <span className="flex items-center gap-1 font-bold text-slate-300">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              RADAR
            </span>
            <span className="text-[9px] text-slate-400">
              X:{telemetry.x.toFixed(0)} Z:{telemetry.z.toFixed(0)}
            </span>
          </div>

          {/* SVG Map of the continuous loop with sweep animation */}
          <div className="relative w-full h-32 flex items-center justify-center">
            {/* Background radar grid circles */}
            <svg viewBox="-90 -80 180 160" className="w-full h-full">
              <circle cx="0" cy="0" r="70" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="0" cy="0" r="45" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="-80" y1="0" x2="80" y2="0" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2 4" />
              <line x1="0" y1="-70" x2="0" y2="70" stroke="#1e293b" strokeWidth="0.6" strokeDasharray="2 4" />

              {/* Road loop path */}
              <path
                d="M 0,62 C -48,40 -74,-4 -46,-46 C 4,-64 50,-40 74,0 C 46,42 20,60 0,62 Z"
                fill="none"
                stroke="#334155"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 0,62 C -48,40 -74,-4 -46,-46 C 4,-64 50,-40 74,0 C 46,42 20,60 0,62 Z"
                fill="none"
                stroke="#0f172a"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {/* Milestone Dots with pulse rings */}
              {JOURNEY_ZONES.map((zone) => {
                const isUnlocked = unlockedZoneIds.includes(zone.id);
                const isCurrent = currentZone.id === zone.id;
                return (
                  <g key={zone.id}>
                    {isCurrent && (
                      <circle
                        cx={zone.position[0]}
                        cy={zone.position[1]}
                        r="7"
                        fill="none"
                        stroke={zone.color}
                        strokeWidth="1"
                        opacity="0.6"
                      />
                    )}
                    <circle
                      cx={zone.position[0]}
                      cy={zone.position[1]}
                      r={isCurrent ? "4.5" : "3.5"}
                      fill={isCurrent ? "#ffffff" : isUnlocked ? zone.color : "#475569"}
                      stroke={isCurrent ? zone.color : "#020617"}
                      strokeWidth="1.5"
                      className="cursor-pointer hover:scale-125 transition-transform"
                      onClick={() => onWarpToZone(zone.id)}
                    />
                  </g>
                );
              })}

              {/* Player Car indicator with heading pointer */}
              <g
                transform={`translate(${telemetry.x}, ${telemetry.z}) rotate(${
                  (-telemetry.angle * 180) / Math.PI
                })`}
              >
                <circle r="3.4" fill="#38bdf8" />
                <polygon points="0,-7 -2.8,0 2.8,0" fill="#38bdf8" />
              </g>
            </svg>
          </div>

          <div className="text-[9px] text-center text-slate-400 font-mono">
            {unlockedCount}/7 Stations Unlocked
          </div>
        </div>
      )}

      {/* 3. EXECUTIVE MILESTONE DOSSIER (RIGHT SIDE) */}
      <div className="absolute top-16 sm:top-20 right-3 sm:right-5 w-[calc(100%-1.5rem)] sm:w-[390px] max-w-full pointer-events-auto z-30 transition-all duration-300">
        <div className="bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">
          {/* Top Specular Hairline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Accent Header Line */}
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${currentZone.color}, #38bdf8)`,
            }}
          />

          <div className="p-4 sm:p-5">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: `${currentZone.color}22`,
                  color: currentZone.color,
                  border: `1px solid ${currentZone.color}44`,
                }}
              >
                <Sparkles className="w-3 h-3" />
                {currentZone.badge || currentZone.kind.toUpperCase()}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsDossierPinned(!isDossierPinned)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    isDossierPinned
                      ? "text-blue-400 bg-blue-500/10 border border-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                  title={isDossierPinned ? "Pinned: Card stays open while driving" : "Pin Dossier Open"}
                >
                  {isDossierPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setDossierExpanded(!dossierExpanded)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
                >
                  <span className="text-[11px]">{dossierExpanded ? "Hide" : "Details"}</span>
                  {dossierExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight leading-snug">
              {currentZone.name}
            </h2>
            <p className="text-xs text-slate-400 mb-2.5">{currentZone.tagline}</p>

            {/* Role & Org */}
            {currentZone.role && (
              <div className="flex flex-col gap-0.5 text-xs text-slate-300 pb-2.5 mb-2.5 border-b border-white/5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{currentZone.role}</span>
                </div>
                {(currentZone.period || currentZone.location) && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    {currentZone.period && (
                      <>
                        <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{currentZone.period}</span>
                      </>
                    )}
                    {currentZone.location && (
                      <>
                        <span>·</span>
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{currentZone.location}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {dossierExpanded && (
              <>
                {/* Achievements / Highlights */}
                {currentZone.highlights.length > 0 && (
                  <div className="mb-3.5">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <Award className="w-3 h-3 text-amber-400" />
                      Key Highlights
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {currentZone.highlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: currentZone.color }}
                          />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Chips */}
                {currentZone.tech.length > 0 && (
                  <div className="mb-3.5">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Code2 className="w-3 h-3 text-blue-400" />
                      Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentZone.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-lg bg-slate-900/90 text-[10px] font-mono text-slate-300 border border-white/5 hover:border-blue-500/40 transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interactive Portal Links (e.g. for Contact / Connect) */}
                {currentZone.links && currentZone.links.length > 0 && (
                  <div className="pt-2.5 border-t border-white/5 grid grid-cols-2 gap-2">
                    {currentZone.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noreferrer" : undefined}
                        className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-white/10 hover:border-blue-400/50 transition-all shadow-md"
                      >
                        <span>{link.label}</span>
                        {link.external && <ExternalLink className="w-3 h-3 text-slate-400" />}
                      </a>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. MOBILE TOUCH ON-SCREEN CONTROLS */}
      <div className="flex justify-between items-end gap-2.5 pointer-events-auto md:hidden pb-14 px-2">
        {/* Left Side: Steering */}
        <div className="flex gap-2 bg-slate-950/85 backdrop-blur-xl p-2 rounded-3xl border border-white/10 shadow-2xl">
          <button
            onTouchStart={() => setControl("left", true)}
            onTouchEnd={() => setControl("left", false)}
            onMouseDown={() => setControl("left", true)}
            onMouseUp={() => setControl("left", false)}
            className="w-12 h-12 rounded-2xl bg-slate-900 active:bg-blue-600 text-white font-bold text-xl flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            onTouchStart={() => setControl("right", true)}
            onTouchEnd={() => setControl("right", false)}
            onMouseDown={() => setControl("right", true)}
            onMouseUp={() => setControl("right", false)}
            className="w-12 h-12 rounded-2xl bg-slate-900 active:bg-blue-600 text-white font-bold text-xl flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
          >
            →
          </button>
        </div>

        {/* Center: Horn Blast */}
        <button
          onTouchStart={() => onTriggerHorn?.()}
          onClick={() => onTriggerHorn?.()}
          className="w-12 h-12 rounded-2xl bg-amber-500/20 active:bg-amber-500 text-amber-400 active:text-slate-950 flex items-center justify-center border border-amber-500/40 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
          title="Honk Car Horn"
        >
          <Megaphone className="w-5 h-5" />
        </button>

        {/* Right Side: Gas & Brake */}
        <div className="flex gap-2 bg-slate-950/85 backdrop-blur-xl p-2 rounded-3xl border border-white/10 shadow-2xl">
          <button
            onTouchStart={() => setControl("backward", true)}
            onTouchEnd={() => setControl("backward", false)}
            onMouseDown={() => setControl("backward", true)}
            onMouseUp={() => setControl("backward", false)}
            className="w-12 h-12 rounded-2xl bg-slate-900 active:bg-amber-600 text-white font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-transform"
            title="Reverse / Brake"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <button
            onTouchStart={() => setControl("forward", true)}
            onTouchEnd={() => setControl("forward", false)}
            onMouseDown={() => setControl("forward", true)}
            onMouseUp={() => setControl("forward", false)}
            className="w-12 h-12 rounded-2xl bg-blue-600 active:bg-blue-500 text-white font-bold flex items-center justify-center border border-blue-400 active:scale-95 transition-transform shadow-lg shadow-blue-600/30"
            title="Drive Forward"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 5. BOTTOM BAR: TACTILE MECHANICAL KEYCAP DOCK & MILESTONE SELECTOR */}
      <div className="flex flex-col items-center gap-2.5 pointer-events-auto">
        {/* Real-time Reactive Keycaps Layout */}
        <div
          className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-2xl border border-white/10 text-[11px] text-slate-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-500 ${
            speedMph > 14 ? "opacity-35 hover:opacity-100" : "opacity-100"
          }`}
        >
          <span className="text-slate-400 mr-1 font-mono text-[10px]">CONTROLS:</span>

          {/* Keycap W */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["w"] || pressedKeys["arrowup"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            W
          </span>
          {/* Keycap A */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["a"] || pressedKeys["arrowleft"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            A
          </span>
          {/* Keycap S */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["s"] || pressedKeys["arrowdown"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            S
          </span>
          {/* Keycap D */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["d"] || pressedKeys["arrowright"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            D
          </span>

          <span className="text-slate-600 mx-1">·</span>

          {/* Keycap Space */}
          <span
            className={`font-mono px-2.5 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys[" "]
                ? "bg-amber-500 text-white border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            Space (Drift)
          </span>

          {/* Keycap H */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["h"]
                ? "bg-amber-500 text-white border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            H (Horn)
          </span>

          {/* Keycap N */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["n"]
                ? "bg-purple-500 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            N (Night)
          </span>

          <span className="text-slate-600 mx-1">·</span>

          {/* Keycap C */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["c"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            C (Cam)
          </span>

          {/* Keycap P */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["p"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            P (Cruise)
          </span>

          {/* Keycap R */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["r"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            R (Reset)
          </span>

          {/* Keycap Z */}
          <span
            className={`font-mono px-2 py-0.5 rounded-lg border text-xs font-bold transition-all ${
              pressedKeys["z"]
                ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)] scale-95"
                : "bg-slate-900 text-slate-300 border-white/10"
            }`}
          >
            Z (Zen)
          </span>
        </div>

        {/* Milestone Selector Dock with Luxury Pill Styling */}
        <div className="max-w-full overflow-x-auto p-1.5 bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex items-center gap-1.5 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {JOURNEY_ZONES.map((zone, idx) => {
            const isActive = currentZone.id === zone.id;
            const isUnlocked = unlockedZoneIds.includes(zone.id);

            return (
              <button
                key={zone.id}
                onClick={() => onWarpToZone(zone.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-800 text-white shadow-lg ring-1 ring-blue-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                }`}
                style={{
                  boxShadow: isActive ? `0 0 20px ${zone.color}44` : undefined,
                }}
                title={`Fast-travel to ${zone.name}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isUnlocked || isActive ? zone.color : "#475569",
                  }}
                />
                <span>{zone.shortName}</span>
                <span className="text-[10px] text-slate-500 font-mono hidden lg:inline">
                  {idx}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. DRIVING GUIDE & SECRETS MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 pointer-events-auto bg-black/75 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Career Journey Guide</h3>
                <p className="text-xs text-slate-400">
                  Interactive physics driving diorama inspired by Bruno Simon
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 space-y-2.5">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Controls &amp; Hotkeys
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">W / ↑</kbd> Accelerate</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">S / ↓</kbd> Reverse / Brake</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">A / D</kbd> Steer Left/Right</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">Space</kbd> Handbrake Drift</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">H</kbd> Car Horn &amp; Beams</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">N</kbd> Midnight Cyber Mode</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">C</kbd> Camera Mode</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">P</kbd> Autopilot Cruise</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">R</kbd> Unflip / Reset</div>
                  <div><kbd className="bg-slate-800 border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">Z</kbd> Zen Mode (UI)</div>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-2xl p-4 border border-white/5 space-y-2.5">
                <div className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Interactive Secrets
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">⚡</span>
                    <span><strong className="text-white">CARS24 Turbo Boost:</strong> Drive over the cyan chevrons at Zone 3 for a -40% latency speed burst!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">🧱</span>
                    <span><strong className="text-white">Tech Stack Yard:</strong> Smash your truck into the pyramid at Zone 6 to topple real tech blocks!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">🏎️</span>
                    <span><strong className="text-white">Tire Skid Marks:</strong> Drift at high speed or brake into turns to leave rubber marks on the asphalt.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold">🎉</span>
                    <span><strong className="text-white">Finish Arch:</strong> Cross the finish line at Zone 7 to launch confetti fireworks.</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              Ready to Drive!
            </button>
          </div>
        </div>
      )}

      {/* 7. EXECUTIVE SUMMARY // FAST-TRACK DRAWER */}
      <ExecutiveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onWarpToZone={onWarpToZone}
        currentZoneId={currentZone.id}
      />
    </div>
  );
};
