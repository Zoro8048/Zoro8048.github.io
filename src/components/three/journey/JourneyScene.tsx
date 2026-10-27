"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Vehicle } from "./Vehicle";
import { WorldBuilder } from "./WorldBuilder";
import { EffectsManager } from "./EffectsManager";
import {
  VehicleControlState,
  DynamicObstacle,
  JourneyZone,
  Telemetry,
  CameraMode,
  LapTimerData,
} from "./types";
import { JOURNEY_ZONES } from "./zonesData";
import { journeyAudio } from "./journeyAudio";
import {
  pointAt,
  headingAt,
  zoneParam,
  ZONE_ENTER_RADIUS,
  nearestTrackIndex,
  getTrackPoints,
} from "./track";

interface JourneySceneProps {
  currentZone: JourneyZone;
  onZoneChange: (zone: JourneyZone) => void;
  onSpeedUpdate: (speedMph: number) => void;
  onTelemetryUpdate: (t: Telemetry) => void;
  externalControls: VehicleControlState;
  warpToZoneId: string | null;
  onWarpHandled: () => void;
  isAutoPilot: boolean;
  onAutoPilotInterrupted: () => void;
  cameraMode: CameraMode;
  onToggleCameraMode?: () => void;
  onToggleHud?: () => void;
  onIntroComplete?: () => void;
  isNightMode?: boolean;
  onToggleNightMode?: () => void;
  isHornTriggered?: boolean;
  onHornTriggerHandled?: () => void;
  onLapDataUpdate?: (data: LapTimerData) => void;
}

export const JourneyScene: React.FC<JourneySceneProps> = ({
  currentZone,
  onZoneChange,
  onSpeedUpdate,
  onTelemetryUpdate,
  externalControls,
  warpToZoneId,
  onWarpHandled,
  isAutoPilot,
  onAutoPilotInterrupted,
  cameraMode,
  onToggleCameraMode,
  onToggleHud,
  onIntroComplete,
  isNightMode = false,
  onToggleNightMode,
  isHornTriggered = false,
  onHornTriggerHandled,
  onLapDataUpdate,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const vehicleRef = useRef<Vehicle | null>(null);
  const controlsRef = useRef<VehicleControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const activeZoneIdRef = useRef<string>(currentZone.id);
  const obstaclesRef = useRef<DynamicObstacle[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const autoPilotParamRef = useRef<number>(0);
  const trackPointsRef = useRef<THREE.Vector3[]>(getTrackPoints(400));
  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isNightModeRef = useRef<boolean>(isNightMode);

  useEffect(() => {
    isNightModeRef.current = isNightMode;
    if (vehicleRef.current) {
      vehicleRef.current.setNightMode(isNightMode);
    }
  }, [isNightMode]);

  useEffect(() => {
    if (isHornTriggered && vehicleRef.current) {
      vehicleRef.current.triggerHornFlash();
      onHornTriggerHandled?.();
    }
  }, [isHornTriggered, onHornTriggerHandled]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  // Sync external controls (from mobile touch buttons)
  useEffect(() => {
    controlsRef.current = {
      forward: controlsRef.current.forward || externalControls.forward,
      backward: controlsRef.current.backward || externalControls.backward,
      left: controlsRef.current.left || externalControls.left,
      right: controlsRef.current.right || externalControls.right,
      brake: controlsRef.current.brake || externalControls.brake,
    };
    if (
      externalControls.forward ||
      externalControls.backward ||
      externalControls.left ||
      externalControls.right
    ) {
      if (isAutoPilot) {
        onAutoPilotInterrupted();
      }
    }
  }, [externalControls, isAutoPilot, onAutoPilotInterrupted]);

  // Handle fast-travel warp
  useEffect(() => {
    if (!warpToZoneId || !vehicleRef.current) return;

    const idx = JOURNEY_ZONES.findIndex((z) => z.id === warpToZoneId);
    if (idx !== -1) {
      const targetZone = JOURNEY_ZONES[idx];
      const t = zoneParam(idx);
      const pos = pointAt(t);
      const heading = headingAt(t);

      vehicleRef.current.resetPosition(pos.x, 0, pos.z, heading);
      activeZoneIdRef.current = targetZone.id;
      autoPilotParamRef.current = t;
      onZoneChange(targetZone);
      journeyAudio.playUnlock();
      onWarpHandled();
    }
  }, [warpToZoneId, onZoneChange, onWarpHandled]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Warm Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.0075);

    // 2. Camera: Stylized isometric elevated chase perspective
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      600
    );
    camera.position.set(0, 22, 28);

    // 3. Renderer with Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      stencil: false,
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 4. Lighting: Soft directional sun + ambient + hemisphere
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.3);
    sunLight.position.set(45, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 240;
    const shadowD = 90;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 5. Build World
    const worldBuilder = new WorldBuilder();
    const world = worldBuilder.build();
    scene.add(world.group);
    obstaclesRef.current = world.dynamicObstacles;

    // 5.1 Effects Manager (Tire Skids, Confetti Fireworks)
    const effectsManager = new EffectsManager(scene);

    // 6. Instantiate Toy Vehicle at starting line
    const vehicle = new Vehicle();
    const startPos = pointAt(0);
    const startHeading = headingAt(0);
    vehicle.resetPosition(startPos.x, 0, startPos.z, startHeading);
    scene.add(vehicle.group);
    vehicleRef.current = vehicle;

    // 7. Keyboard Driving Controls
    const handleKeyDown = (e: KeyboardEvent) => {
      // Any key press skips the intro crane shot instantly
      if (!introFinished) {
        introTime = INTRO_DURATION;
        introFinished = true;
        journeyAudio.playIntroFanfare();
        onIntroComplete?.();
      }

      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          controlsRef.current.forward = true;
          if (isAutoPilot) onAutoPilotInterrupted();
          break;
        case "s":
        case "arrowdown":
          controlsRef.current.backward = true;
          if (isAutoPilot) onAutoPilotInterrupted();
          break;
        case "a":
        case "arrowleft":
          controlsRef.current.left = true;
          if (isAutoPilot) onAutoPilotInterrupted();
          break;
        case "d":
        case "arrowright":
          controlsRef.current.right = true;
          if (isAutoPilot) onAutoPilotInterrupted();
          break;
        case " ":
          e.preventDefault();
          controlsRef.current.brake = true;
          break;
        case "h":
          vehicle.triggerHornFlash();
          break;
        case "n":
          onToggleNightMode?.();
          break;
        case "z":
          onToggleHud?.();
          break;
        case "r":
          // Reset / unflip car to nearest road point
          const nearestIdx = nearestTrackIndex(
            trackPointsRef.current,
            vehicle.position.x,
            vehicle.position.z
          );
          const p = trackPointsRef.current[nearestIdx];
          const nextP = trackPointsRef.current[(nearestIdx + 1) % trackPointsRef.current.length];
          const angle = Math.atan2(nextP.x - p.x, nextP.z - p.z);
          vehicle.resetPosition(p.x, 0, p.z, angle);
          journeyAudio.playThud();
          break;
        case "c":
          onToggleCameraMode?.();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          controlsRef.current.forward = false;
          break;
        case "s":
        case "arrowdown":
          controlsRef.current.backward = false;
          break;
        case "a":
        case "arrowleft":
          controlsRef.current.left = false;
          break;
        case "d":
        case "arrowright":
          controlsRef.current.right = false;
          break;
        case " ":
          controlsRef.current.brake = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 7.1 Desktop Pointer Parallax Tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    // Clicking anywhere skips intro crane shot smoothly
    const handlePointerDown = () => {
      if (!introFinished) {
        introTime = INTRO_DURATION;
        introFinished = true;
        journeyAudio.playIntroFanfare();
        onIntroComplete?.();
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // 9. Main Physics & Render Loop
    const clock = new THREE.Clock();
    const camTarget = new THREE.Vector3();
    const camLookAt = new THREE.Vector3();
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // Intro Crane Shot variables
    let introTime = 0;
    const INTRO_DURATION = 2.4;
    let introFinished = false;

    // Day/Night Smooth Interpolation variable
    let currentNightLerp = isNightModeRef.current ? 1.0 : 0.0;

    // Circuit Lap Timer & Sector Split State
    let lapRunning = false;
    let lapStartTime = 0;
    let bestLapMs: number | null = null;
    let lastLapMs: number | null = null;
    let currentSector = 1;
    const sectorSplits: { [sector: number]: number } = {};
    let lapBanner: string | null = null;
    let lapBannerTimer = 0;
    let newRecord = false;
    let hasCrossedStartLine = false;
    let lastLapUpdate = 0;

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("career_journey_pb_lap");
        if (stored) bestLapMs = parseInt(stored, 10);
      } catch {
        // ignore
      }
    }

    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);

      // 0. Smooth Day/Night Lighting Transition
      const targetNight = isNightModeRef.current ? 1.0 : 0.0;
      currentNightLerp = THREE.MathUtils.lerp(currentNightLerp, targetNight, delta * 3.5);

      const dayBg = new THREE.Color(0x0a0f1d);
      const nightBg = new THREE.Color(0x020617);
      scene.background = new THREE.Color().lerpColors(dayBg, nightBg, currentNightLerp);
      if (scene.fog) {
        scene.fog.color.copy(scene.background as THREE.Color);
        (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(0.0075, 0.0095, currentNightLerp);
      }

      const daySunColor = new THREE.Color(0xfff7ed);
      const nightSunColor = new THREE.Color(0x818cf8);
      sunLight.color.lerpColors(daySunColor, nightSunColor, currentNightLerp);
      sunLight.intensity = THREE.MathUtils.lerp(2.3, 0.45, currentNightLerp);

      const dayAmbient = new THREE.Color(0x38bdf8);
      const nightAmbient = new THREE.Color(0x1e1b4b);
      ambientLight.color.lerpColors(dayAmbient, nightAmbient, currentNightLerp);
      ambientLight.intensity = THREE.MathUtils.lerp(0.9, 0.45, currentNightLerp);
      hemiLight.intensity = THREE.MathUtils.lerp(0.85, 0.35, currentNightLerp);

      // Handle Autopilot mode along CatmullRom track
      if (isAutoPilot) {
        autoPilotParamRef.current = (autoPilotParamRef.current + delta * 0.02) % 1;
        const targetPos = pointAt(autoPilotParamRef.current);
        const targetHeading = headingAt(autoPilotParamRef.current);

        vehicle.position.lerp(targetPos, 0.1);
        vehicle.angle = THREE.MathUtils.lerp(vehicle.angle, targetHeading, 0.1);
        vehicle.speed = 18.0;
        vehicle.group.position.set(vehicle.position.x, 0, vehicle.position.z);
        vehicle.group.rotation.y = vehicle.angle;
      } else {
        // Manual driving controls
        const activeControls: VehicleControlState = {
          forward: controlsRef.current.forward || externalControls.forward,
          backward: controlsRef.current.backward || externalControls.backward,
          left: controlsRef.current.left || externalControls.left,
          right: controlsRef.current.right || externalControls.right,
          brake: controlsRef.current.brake || externalControls.brake,
        };

        vehicle.update(delta, activeControls);
      }

      // Speed in MPH for speedometer HUD
      const speedMph = Math.round(Math.abs(vehicle.speed) * 2.2);
      onSpeedUpdate(speedMph);
      onTelemetryUpdate(vehicle.getTelemetry());

      // 1.1 Drift Skid Marks
      if (vehicle.isDrifting()) {
        const wheels = vehicle.getRearWheelPositions();
        effectsManager.addSkidMark(
          wheels.left,
          wheels.right,
          vehicle.angle,
          Math.abs(vehicle.speed) / 24
        );
      }

      // 2. CARS24 Turbo Boost Pad Check
      const b = world.boostPadBounds;
      if (
        vehicle.position.x >= b.xMin &&
        vehicle.position.x <= b.xMax &&
        vehicle.position.z >= b.zMin &&
        vehicle.position.z <= b.zMax &&
        !vehicle.isBoosting
      ) {
        vehicle.triggerTurboBoost(3.0);
      }

      // 3. Dynamic Obstacle Collisions (Tech stack blocks)
      obstaclesRef.current.forEach((obs) => {
        const dist = vehicle.position.distanceTo(obs.mesh.position);
        if (dist < obs.radius + 1.8) {
          const dir = new THREE.Vector3()
            .subVectors(obs.mesh.position, vehicle.position)
            .normalize();

          const impulseSpeed = Math.max(14, Math.abs(vehicle.speed) * 1.6);
          obs.velocity.addScaledVector(dir, impulseSpeed);
          obs.velocity.y += 4.5;
          obs.angularVelocity.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8
          );

          journeyAudio.playHit(impulseSpeed);
        }

        // Obstacle physics update
        if (obs.velocity.lengthSq() > 0.01) {
          obs.velocity.y -= 18.0 * delta;
          obs.mesh.position.addScaledVector(obs.velocity, delta);

          if (obs.mesh.position.y < 1.0) {
            obs.mesh.position.y = 1.0;
            obs.velocity.y = -obs.velocity.y * 0.35;
            obs.velocity.x *= 0.85;
            obs.velocity.z *= 0.85;
          }

          obs.mesh.rotation.x += obs.angularVelocity.x * delta;
          obs.mesh.rotation.y += obs.angularVelocity.y * delta;
          obs.mesh.rotation.z += obs.angularVelocity.z * delta;
          obs.angularVelocity.multiplyScalar(0.96);
        }
      });

      // 4. Zone Proximity Detection
      let closestZone: JourneyZone | null = null;
      let minZoneDist = Infinity;

      for (const zone of JOURNEY_ZONES) {
        const d = Math.hypot(
          vehicle.position.x - zone.position[0],
          vehicle.position.z - zone.position[1]
        );
        if (d < ZONE_ENTER_RADIUS && d < minZoneDist) {
          minZoneDist = d;
          closestZone = zone;
        }
      }

      if (closestZone && closestZone.id !== activeZoneIdRef.current) {
        activeZoneIdRef.current = closestZone.id;
        onZoneChange(closestZone);

        // Finish line celebration confetti & fanfare
        if (closestZone.id === "contact") {
          effectsManager.launchConfetti(vehicle.position, 160);
          journeyAudio.playVictory();
        } else {
          journeyAudio.playUnlock();
        }
      }

      // 4.1 Real-Time Circuit Lap Timer & Sector Split Tracking
      const nowMs = performance.now();
      const distToStart = Math.hypot(vehicle.position.x - 0, vehicle.position.z - 62);

      if (distToStart < 10.0) {
        if (!hasCrossedStartLine) {
          hasCrossedStartLine = true;
          if (!lapRunning) {
            lapRunning = true;
            lapStartTime = nowMs;
            currentSector = 1;
            Object.keys(sectorSplits).forEach((k) => delete sectorSplits[Number(k)]);
            lapBanner = "⏱️ LAP STARTED · GO!";
            lapBannerTimer = 2.0;
            journeyAudio.playSectorSplit();
          } else if (currentSector >= 3) {
            const totalElapsed = Math.round(nowMs - lapStartTime);
            lastLapMs = totalElapsed;
            if (!bestLapMs || totalElapsed < bestLapMs) {
              bestLapMs = totalElapsed;
              newRecord = true;
              lapBanner = "🏆 NEW RECORD!";
              try {
                localStorage.setItem("career_journey_pb_lap", totalElapsed.toString());
              } catch {
                // ignore
              }
              effectsManager.launchConfetti(vehicle.position, 160);
              journeyAudio.playRecordFanfare();
            } else {
              newRecord = false;
              lapBanner = "🏁 LAP COMPLETE";
              journeyAudio.playLapComplete();
            }
            lapBannerTimer = 4.5;
            lapStartTime = nowMs;
            currentSector = 1;
            Object.keys(sectorSplits).forEach((k) => delete sectorSplits[Number(k)]);
          }
        }
      } else if (distToStart > 18.0) {
        hasCrossedStartLine = false;
      }

      if (lapRunning) {
        // Sector 1: NeoGrowth [-74, -4]
        if (currentSector === 1 && Math.hypot(vehicle.position.x - (-74), vehicle.position.z - (-4)) < 16) {
          currentSector = 2;
          sectorSplits[1] = Math.round(nowMs - lapStartTime);
          journeyAudio.playSectorSplit();
        }
        // Sector 2: Stony Brook [4, -64]
        else if (currentSector === 2 && Math.hypot(vehicle.position.x - 4, vehicle.position.z - (-64)) < 16) {
          currentSector = 3;
          sectorSplits[2] = Math.round(nowMs - lapStartTime);
          journeyAudio.playSectorSplit();
        }
        // Sector 3: Skills Yard [74, 0]
        else if (currentSector === 3 && Math.hypot(vehicle.position.x - 74, vehicle.position.z - 0) < 16) {
          currentSector = 4;
          sectorSplits[3] = Math.round(nowMs - lapStartTime);
          journeyAudio.playSectorSplit();
        }
      }

      if (lapBannerTimer > 0) {
        lapBannerTimer -= delta;
        if (lapBannerTimer <= 0) lapBanner = null;
      }

      if (nowMs - lastLapUpdate > 33 && onLapDataUpdate) {
        lastLapUpdate = nowMs;
        const elapsed = lapRunning ? Math.round(nowMs - lapStartTime) : 0;
        const deltaToBest = bestLapMs && lapRunning ? elapsed - bestLapMs : null;
        onLapDataUpdate({
          isActive: true,
          running: lapRunning,
          elapsedMs: elapsed,
          bestLapMs,
          lastLapMs,
          currentSector,
          sectorSplits,
          deltaToBestMs: deltaToBest,
          newRecord,
          lapBanner,
        });
      }

      // 5. Multi-Mode Camera System, Interactive Desktop Parallax & Dynamic FOV
      const targetFov = vehicle.isBoosting ? 52 : 45;
      if (Math.abs(camera.fov - targetFov) > 0.1) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.08);
        camera.updateProjectionMatrix();
      }

      // Check if Cinematic Crane Intro is active
      if (introTime < INTRO_DURATION) {
        introTime += delta;
        const p = Math.min(1.0, introTime / INTRO_DURATION);
        const ease = p * p * (3 - 2 * p); // smoothstep curve

        const craneStart = new THREE.Vector3(38, 92, 108);
        const targetEnd = new THREE.Vector3(
          vehicle.position.x,
          vehicle.position.y + 19,
          vehicle.position.z + 24
        );
        camera.position.lerpVectors(craneStart, targetEnd, ease);

        const lookStart = new THREE.Vector3(0, 0, 30);
        const lookEnd = new THREE.Vector3(
          vehicle.position.x,
          0.8,
          vehicle.position.z + 4
        );
        camLookAt.lerpVectors(lookStart, lookEnd, ease);
        camera.lookAt(camLookAt);

        if (p >= 1.0 && !introFinished) {
          introFinished = true;
          journeyAudio.playIntroFanfare();
          onIntroComplete?.();
        }
      } else {
        // Smooth mouse cursor parallax tilt
        const targetParallaxX = mouseRef.current.x * 4.2;
        const targetParallaxY = mouseRef.current.y * 2.6;
        currentParallaxX = THREE.MathUtils.lerp(currentParallaxX, targetParallaxX, 0.05);
        currentParallaxY = THREE.MathUtils.lerp(currentParallaxY, targetParallaxY, 0.05);

        // Speed-dependent camera inertia lag
        const speedLag = (vehicle.speed / 24) * 2.2;
        const lagX = -Math.sin(vehicle.angle) * speedLag;
        const lagZ = -Math.cos(vehicle.angle) * speedLag;

        const currentMode = cameraModeRef.current;
        if (currentMode === "isometric") {
          camTarget.set(
            vehicle.position.x + currentParallaxX + lagX,
            vehicle.position.y + 19 + currentParallaxY,
            vehicle.position.z + 24 + lagZ
          );
          camera.position.lerp(camTarget, 0.07);

          const lookAhead = new THREE.Vector3(
            Math.sin(vehicle.angle) * 4 + currentParallaxX * 0.35,
            0.8,
            Math.cos(vehicle.angle) * 4
          );
          camLookAt.copy(vehicle.position).add(lookAhead);
          camera.lookAt(camLookAt);
        } else if (currentMode === "close") {
          const behindX = vehicle.position.x - Math.sin(vehicle.angle) * 10 + currentParallaxX * 0.4;
          const behindZ = vehicle.position.z - Math.cos(vehicle.angle) * 10;
          camTarget.set(behindX, vehicle.position.y + 5.5 + currentParallaxY * 0.4, behindZ);
          camera.position.lerp(camTarget, 0.1);

          const frontX = vehicle.position.x + Math.sin(vehicle.angle) * 6;
          const frontZ = vehicle.position.z + Math.cos(vehicle.angle) * 6;
          camLookAt.set(frontX, vehicle.position.y + 1.2, frontZ);
          camera.lookAt(camLookAt);
        } else if (currentMode === "drone") {
          camTarget.set(vehicle.position.x + currentParallaxX * 2, 58, vehicle.position.z + 12 + currentParallaxY * 2);
          camera.position.lerp(camTarget, 0.05);
          camLookAt.set(vehicle.position.x, 0, vehicle.position.z);
          camera.lookAt(camLookAt);
        }
      }

      // 6. Update Visual Effects (Skids fading, confetti falling)
      effectsManager.update(delta);

      // Keep sun light centered around vehicle
      sunLight.position.set(
        vehicle.position.x + 40,
        75,
        vehicle.position.z + 45
      );
      sunLight.target.position.copy(vehicle.position);
      sunLight.target.updateMatrixWorld();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);

      effectsManager.dispose();
      vehicle.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [
    onZoneChange,
    onSpeedUpdate,
    onTelemetryUpdate,
    externalControls,
    isAutoPilot,
    onAutoPilotInterrupted,
    onToggleCameraMode,
    onToggleHud,
    onIntroComplete,
    onToggleNightMode,
    onLapDataUpdate,
  ]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#0a0f1d]"
      style={{ touchAction: "none" }}
    />
  );
};
