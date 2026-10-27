"use client";

import React, { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { JourneyHUD } from "../../components/three/journey/JourneyHUD";
import { JOURNEY_ZONES } from "../../components/three/journey/zonesData";
import {
  JourneyZone,
  VehicleControlState,
  Telemetry,
  CameraMode,
  LapTimerData,
} from "../../components/three/journey/types";

// Dynamically import the 3D Journey Canvas Scene without SSR to guarantee clean WebGL & Physics execution
const JourneyScene = dynamic(
  () =>
    import("../../components/three/journey/JourneyScene").then(
      (mod) => mod.JourneyScene
    ),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0f1d] text-white">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-full border-2 border-t-blue-500 border-r-amber-400 border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-blue-600/20 backdrop-blur-md flex items-center justify-center text-xs font-bold font-mono text-blue-400">
            3D
          </div>
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Starting Engine &amp; Assembling Career World...
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Loading road track, vehicle physics, milestone districts &amp; skill obstacles
        </p>
      </div>
    ),
  }
);

export default function ThreeDPortfolioPage() {
  const [currentZone, setCurrentZone] = useState<JourneyZone>(JOURNEY_ZONES[0]);
  const [speedMph, setSpeedMph] = useState<number>(0);
  const [telemetry, setTelemetry] = useState<Telemetry>({
    x: 0,
    z: 62,
    angle: 0,
    speed: 0,
    boosting: false,
  });
  const [unlockedZoneIds, setUnlockedZoneIds] = useState<string[]>([JOURNEY_ZONES[0].id]);
  const [warpToZoneId, setWarpToZoneId] = useState<string | null>(null);
  const [isAutoPilot, setIsAutoPilot] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>("isometric");
  const [hudVisible, setHudVisible] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [isHornTriggered, setIsHornTriggered] = useState<boolean>(false);
  const [lapData, setLapData] = useState<LapTimerData | null>(null);
  const [externalControls, setExternalControls] = useState<VehicleControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const handleZoneChange = useCallback((zone: JourneyZone) => {
    setCurrentZone(zone);
    setUnlockedZoneIds((prev) => (prev.includes(zone.id) ? prev : [...prev, zone.id]));
  }, []);

  const handleWarpToZone = (zoneId: string) => {
    setWarpToZoneId(zoneId);
  };

  const handleWarpHandled = () => {
    setWarpToZoneId(null);
  };

  const handleToggleAutoPilot = useCallback(() => {
    setIsAutoPilot((prev) => !prev);
  }, []);

  const handleAutoPilotInterrupted = useCallback(() => {
    setIsAutoPilot(false);
  }, []);

  const handleCycleCameraMode = useCallback(() => {
    setCameraMode((prev) => {
      if (prev === "isometric") return "close";
      if (prev === "close") return "drone";
      return "isometric";
    });
  }, []);

  const handleToggleHud = useCallback(() => {
    setHudVisible((prev) => !prev);
  }, []);

  const handleToggleNightMode = useCallback(() => {
    setIsNightMode((prev) => !prev);
  }, []);

  const handleTriggerHorn = useCallback(() => {
    setIsHornTriggered(true);
  }, []);

  const handleHornTriggerHandled = useCallback(() => {
    setIsHornTriggered(false);
  }, []);

  // Global hotkeys for Autopilot [P], Camera [C], Zen [Z], Night [N], Horn [H]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      const k = e.key.toLowerCase();
      if (k === "p") {
        handleToggleAutoPilot();
      } else if (k === "c") {
        handleCycleCameraMode();
      } else if (k === "z") {
        handleToggleHud();
      } else if (k === "n") {
        handleToggleNightMode();
      } else if (k === "h") {
        handleTriggerHorn();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleToggleAutoPilot,
    handleCycleCameraMode,
    handleToggleHud,
    handleToggleNightMode,
    handleTriggerHorn,
  ]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0f1d] select-none">
      {/* 3D WebGL Driving Journey Scene */}
      <JourneyScene
        currentZone={currentZone}
        onZoneChange={handleZoneChange}
        onSpeedUpdate={setSpeedMph}
        onTelemetryUpdate={setTelemetry}
        externalControls={externalControls}
        warpToZoneId={warpToZoneId}
        onWarpHandled={handleWarpHandled}
        isAutoPilot={isAutoPilot}
        onAutoPilotInterrupted={handleAutoPilotInterrupted}
        cameraMode={cameraMode}
        onToggleCameraMode={handleCycleCameraMode}
        onToggleHud={handleToggleHud}
        isNightMode={isNightMode}
        onToggleNightMode={handleToggleNightMode}
        isHornTriggered={isHornTriggered}
        onHornTriggerHandled={handleHornTriggerHandled}
        onLapDataUpdate={setLapData}
      />

      {/* Futuristic HUD & Driving Controls Layer */}
      <JourneyHUD
        currentZone={currentZone}
        speedMph={speedMph}
        telemetry={telemetry}
        unlockedZoneIds={unlockedZoneIds}
        isAutoPilot={isAutoPilot}
        onToggleAutoPilot={handleToggleAutoPilot}
        onWarpToZone={handleWarpToZone}
        onUpdateExternalControls={setExternalControls}
        cameraMode={cameraMode}
        onCycleCameraMode={handleCycleCameraMode}
        hudVisible={hudVisible}
        onToggleHud={handleToggleHud}
        isNightMode={isNightMode}
        onToggleNightMode={handleToggleNightMode}
        onTriggerHorn={handleTriggerHorn}
        lapData={lapData}
      />
    </main>
  );
}
