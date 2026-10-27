import * as THREE from "three";

/**
 * Procedural canvas-based texture generator for 3D signage and physics blocks.
 * Zero external asset dependencies; crisp 2D canvas rendered to WebGL texture.
 */

// Cache textures to avoid recreating duplicate canvases
const textureCache = new Map<string, THREE.CanvasTexture>();

export function createTextTexture({
  title,
  subtitle,
  bgColor = "#1e293b",
  textColor = "#ffffff",
  accentColor = "#38bdf8",
  width = 512,
  height = 256,
  borderWidth = 12,
  isTechCube = false,
}: {
  title: string;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  width?: number;
  height?: number;
  borderWidth?: number;
  isTechCube?: boolean;
}): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    // SSR fallback dummy
    return new THREE.Texture() as unknown as THREE.CanvasTexture;
  }

  const cacheKey = `${title}_${subtitle}_${bgColor}_${textColor}_${accentColor}_${width}_${height}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // 1. Background fill
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Glowing outer border
  if (borderWidth > 0) {
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(borderWidth / 2, borderWidth / 2, width - borderWidth, height - borderWidth);
  }

  if (isTechCube) {
    // Stylized tech stack block design
    // Top highlight band
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, width, 24);

    // Main Logo / Text in center
    ctx.fillStyle = textColor;
    ctx.font = "900 68px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 10;
    ctx.fillText(title, width / 2, height / 2);

    // Subtle corner badge
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 24px monospace";
    ctx.fillText("DEV", width - 48, height - 32);
  } else {
    // Milestone Landmark Signboard
    // Accent banner at top
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, width, 18);

    // Title
    ctx.fillStyle = textColor;
    ctx.font = "900 44px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 8;
    ctx.fillText(title, width / 2, subtitle ? height * 0.42 : height / 2);

    // Subtitle if provided
    if (subtitle) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = accentColor;
      ctx.font = "700 24px system-ui, -apple-system, monospace";
      ctx.fillText(subtitle, width / 2, height * 0.72);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  textureCache.set(cacheKey, texture);

  return texture;
}

/** Checkered pattern texture for Start / Finish road lines */
export function createCheckeredTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.Texture() as unknown as THREE.CanvasTexture;
  }

  const key = "checkered_flag_tex";
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cols = 8;
  const rows = 4;
  const cw = canvas.width / cols;
  const ch = canvas.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? "#ffffff" : "#0f172a";
      ctx.fillRect(c * cw, r * ch, cw, ch);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/** Soft radial contact shadow texture for grounding buildings, trees, and pedestals */
export function createContactShadowTexture(): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.Texture() as unknown as THREE.CanvasTexture;
  }
  const key = "ao_contact_shadow_tex";
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.85)");
  grad.addColorStop(0.4, "rgba(0, 0, 0, 0.5)");
  grad.addColorStop(0.8, "rgba(0, 0, 0, 0.15)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}
