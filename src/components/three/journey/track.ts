import * as THREE from "three";
import { JOURNEY_ZONES } from "./zonesData";

export const ROAD_WIDTH = 9;
/** Distance from a zone's road point at which the zone becomes active. */
export const ZONE_ENTER_RADIUS = 14;
export const ZONE_EXIT_RADIUS = 18;

let cachedCurve: THREE.CatmullRomCurve3 | null = null;

/** Closed road loop that passes through every zone, in journey order. */
export function getTrackCurve(): THREE.CatmullRomCurve3 {
  if (!cachedCurve) {
    cachedCurve = new THREE.CatmullRomCurve3(
      JOURNEY_ZONES.map((z) => new THREE.Vector3(z.position[0], 0, z.position[1])),
      true,
      "catmullrom",
      0.5
    );
  }
  return cachedCurve;
}

const wrap01 = (t: number) => ((t % 1) + 1) % 1;

/** Curve parameter at which the road passes through zone `index`. */
export function zoneParam(index: number): number {
  return index / JOURNEY_ZONES.length;
}

export function pointAt(t: number): THREE.Vector3 {
  return getTrackCurve().getPoint(wrap01(t));
}

/** Vehicle heading (radians, forward = (sin a, cos a)) along the road at `t`. */
export function headingAt(t: number): number {
  const tan = getTrackCurve().getTangent(wrap01(t));
  return Math.atan2(tan.x, tan.z);
}

/** Evenly spaced points along the loop. The last point equals the first. */
export function getTrackPoints(divisions = 480): THREE.Vector3[] {
  return getTrackCurve().getSpacedPoints(divisions);
}

export function distanceToTrack(points: THREE.Vector3[], x: number, z: number): number {
  let min = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const abx = b.x - a.x;
    const abz = b.z - a.z;
    const len2 = abx * abx + abz * abz || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * abx + (z - a.z) * abz) / len2));
    const dx = x - (a.x + abx * t);
    const dz = z - (a.z + abz * t);
    const d = dx * dx + dz * dz;
    if (d < min) min = d;
  }
  return Math.sqrt(min);
}

/** Index of the track point closest to (x, z). */
export function nearestTrackIndex(points: THREE.Vector3[], x: number, z: number): number {
  let best = 0;
  let min = Infinity;
  points.forEach((p, i) => {
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < min) {
      min = d;
      best = i;
    }
  });
  return best;
}
