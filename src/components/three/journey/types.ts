import * as THREE from "three";

export type ZoneKind = "start" | "education" | "work" | "skills" | "contact";

export type CameraMode = "isometric" | "close" | "drone";

export interface ZoneLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface JourneyZone {
  id: string;
  /** Short label used on signs, the minimap and the progress tracker. */
  shortName: string;
  name: string;
  /** Milestones count towards journey progress and get a light beam. */
  milestone: boolean;
  kind: ZoneKind;
  role: string;
  org: string;
  period: string;
  location: string;
  tagline: string;
  badge?: string;
  color: string;
  /** World position on the ground plane: [x, z]. */
  position: [number, number];
  highlights: string[];
  tech: string[];
  links?: ZoneLink[];
}

export interface VehicleControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

/** Mutable per-frame vehicle state shared with the HUD without React re-renders. */
export interface Telemetry {
  x: number;
  z: number;
  angle: number;
  speed: number;
  boosting: boolean;
}

/** Imperative controls exposed by the 3D scene. */
export interface JourneyApi {
  warp: (zoneId: string) => void;
  reset: () => void;
}

export interface DynamicObstacle {
  mesh: THREE.Mesh | THREE.Group;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Vector3;
  mass: number;
  radius: number;
  initialPos: THREE.Vector3;
}

export interface LapTimerData {
  isActive: boolean;
  running: boolean;
  elapsedMs: number;
  bestLapMs: number | null;
  lastLapMs: number | null;
  currentSector: number; // 1 to 4
  sectorSplits: { [sector: number]: number };
  deltaToBestMs: number | null;
  newRecord: boolean;
  lapBanner: string | null;
}
