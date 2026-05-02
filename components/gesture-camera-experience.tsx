"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Camera } from "lucide-react";
import type { HandLandmarker } from "@mediapipe/tasks-vision";

type Landmark = {
  x: number;
  y: number;
  z?: number;
};

type GestureKey = "open_palm" | "fist" | "pinch" | "point" | "swipe_left" | "swipe_right" | "none";

type EnergyParticle = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color?: EnergyColor;
};

type EnergyColor = "red" | "blue" | "purple";

type OrbPhase = "idle" | "red_charging" | "red_ready" | "blue_charging" | "blue_ready" | "merging" | "combined" | "exploded";

type Point = {
  x: number;
  y: number;
};

type OrbRitualState = {
  phase: OrbPhase;
  redStartedAt: number | null;
  blueStartedAt: number | null;
  redPoint: Point | null;
  bluePoint: Point | null;
  purplePoint: Point | null;
  purpleAnchorPoint: Point | null;
  combinedAt: number | null;
  explodedAt: number | null;
};

type ScreenParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  color?: EnergyColor;
  absorbing?: boolean;
};

type TrackedHand = {
  landmarks: Landmark[];
  gesture: GestureKey;
  point: Point;
  depth: number;
};

const CHARGE_DURATION = 3000;
const CHARGE_CELLS = 7;
const MERGE_DURATION = 2200;
const DETECTION_INTERVAL_MS = 1000 / 30;
const MAX_CANVAS_DPR = 1.5;
const RITUAL_PROGRESS_EPSILON = 0.02;

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
] as const;

function getRitualGuide(phase: OrbPhase, progress: number) {
  if (phase === "red_charging") {
    return {
      eyebrow: "Step 01",
      title: `Charging red orb (${Math.min(Math.floor(progress * CHARGE_CELLS), CHARGE_CELLS)} / ${CHARGE_CELLS} cells)`,
      body: "Keep this index finger steady. If you remove it before the cells lock, the red charge resets.",
      tone: "red",
    };
  }

  if (phase === "red_ready") {
    return {
      eyebrow: "Step 02",
      title: "Red locked. Raise your other index finger.",
      body: "Only the other finger can charge blue. Keep red visible while you begin the second charge.",
      tone: "red",
    };
  }

  if (phase === "blue_charging") {
    return {
      eyebrow: "Step 03",
      title: `Charging blue orb (${Math.min(Math.floor(progress * CHARGE_CELLS), CHARGE_CELLS)} / ${CHARGE_CELLS} cells)`,
      body: "Hold the second finger steady until all cells lock. Removing it resets blue only.",
      tone: "blue",
    };
  }

  if (phase === "blue_ready") {
    return {
      eyebrow: "Step 04",
      title: "Blue locked. Bring both charged fingers close.",
      body: "Move red and blue together. When they meet, the merge sequence begins.",
      tone: "blue",
    };
  }

  if (phase === "merging") {
    return {
      eyebrow: "Fusion",
      title: "Red and blue are blending into purple.",
      body: "Hold steady while the two charged orbs flow into one larger purple orb.",
      tone: "purple",
    };
  }

  if (phase === "combined") {
    return {
      eyebrow: "Final Form",
      title: "Purple orb formed. Pinch the same hand.",
      body: "The orb is anchored to one finger. Pinch that same hand to release the explosion.",
      tone: "purple",
    };
  }

  if (phase === "exploded") {
    return {
      eyebrow: "Aftermath",
      title: "Purple particles released.",
      body: "Use a full open hand to clear the particles, or point again to pull energy into the next orb.",
      tone: "purple",
    };
  }

  return {
    eyebrow: "Ready",
    title: "Start with one index finger.",
    body: "Click start, show your hand, then point one index finger to begin charging red energy.",
    tone: "neutral",
  };
}

function distance(a: Landmark, b: Landmark) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function isFingerExtended(landmarks: Landmark[], tip: number, pip: number) {
  return landmarks[tip].y < landmarks[pip].y - 0.025;
}

function detectGesture(landmarks: Landmark[]): GestureKey {
  const indexExtended = isFingerExtended(landmarks, 8, 6);
  const middleExtended = isFingerExtended(landmarks, 12, 10);
  const ringExtended = isFingerExtended(landmarks, 16, 14);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18);
  const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
  const pinchDistance = distance(landmarks[4], landmarks[8]);

  if (pinchDistance < 0.055) return "pinch";
  if (extendedCount >= 4) return "open_palm";
  if (extendedCount === 0) return "fist";
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return "point";

  return "none";
}

function toCanvasPoint(canvas: HTMLCanvasElement, landmark: Landmark): Point {
  return {
    x: canvas.width - landmark.x * canvas.width,
    y: landmark.y * canvas.height,
  };
}

function getFingerDepth(landmarks: Landmark[]) {
  return landmarks[8].z ?? 0;
}

function isSamePointingHand(hand: { point: Point }, target: Point | null, threshold = 140) {
  return Boolean(target && distance(hand.point, target) < threshold);
}

function findClosestHand(hands: TrackedHand[], target: Point | null, threshold = 220): TrackedHand | null {
  if (!target) return null;

  let closest: TrackedHand | null = null;
  let closestDistance = threshold;

  hands.forEach((hand) => {
    const handDistance = distance(hand.point, target);
    if (handDistance < closestDistance) {
      closest = hand;
      closestDistance = handDistance;
    }
  });

  return closest;
}

function lerpPoint(a: Point, b: Point, progress: number): Point {
  return {
    x: a.x + (b.x - a.x) * progress,
    y: a.y + (b.y - a.y) * progress,
  };
}

function getEnergyPalette(color: EnergyColor) {
  if (color === "blue") {
    return {
      core: "rgba(7, 12, 38, 0.98)",
      inner: "rgba(70, 180, 255, 0.92)",
      middle: "rgba(0, 105, 255, 0.62)",
      outer: "rgba(0, 44, 160, 0)",
      flare: "rgba(74, 185, 255, 0.8)",
      particle: "rgba(86, 200, 255, 0.76)",
    };
  }

  if (color === "purple") {
    return {
      core: "rgba(15, 0, 34, 0.98)",
      inner: "rgba(230, 132, 255, 0.95)",
      middle: "rgba(144, 38, 255, 0.72)",
      outer: "rgba(70, 0, 140, 0)",
      flare: "rgba(208, 90, 255, 0.82)",
      particle: "rgba(210, 120, 255, 0.82)",
    };
  }

  return {
    core: "rgba(5, 0, 2, 0.98)",
    inner: "rgba(255, 36, 77, 0.92)",
    middle: "rgba(210, 0, 42, 0.58)",
    outer: "rgba(10, 0, 0, 0)",
    flare: "rgba(255, 24, 66, 0.82)",
    particle: "rgba(255, 42, 84, 0.76)",
  };
}

function spawnInwardParticles(particles: EnergyParticle[], point: Point, color: EnergyColor, count = 5) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 72 + Math.random() * 125;
    const particleX = point.x + Math.cos(angle) * radius;
    const particleY = point.y + Math.sin(angle) * radius;

    particles.push({
      x: particleX,
      y: particleY,
      previousX: particleX,
      previousY: particleY,
      vx: Math.cos(angle + Math.PI) * (0.6 + Math.random() * 1.3),
      vy: Math.sin(angle + Math.PI) * (0.6 + Math.random() * 1.3),
      life: 1,
      size: 1.5 + Math.random() * 3.5,
      color,
    });
  }

  if (particles.length > 240) {
    particles.splice(0, particles.length - 240);
  }
}

function getCanvasContext(canvas: HTMLCanvasElement) {
  return canvas.getContext("2d", { alpha: true, desynchronized: true });
}

function syncCanvasSize(canvas: HTMLCanvasElement, video: HTMLVideoElement | null, cachedSize: { width: number; height: number }) {
  const rect = canvas.getBoundingClientRect();
  const displayWidth = Math.round(rect.width || video?.videoWidth || 640);
  const displayHeight = Math.round(rect.height || video?.videoHeight || 480);
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
  const width = Math.round(displayWidth * dpr);
  const height = Math.round(displayHeight * dpr);

  if (cachedSize.width === width && cachedSize.height === height) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;
  cachedSize.width = width;
  cachedSize.height = height;

  return true;
}

function drawChargedOrb(
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: EnergyColor,
  chargeProgress: number,
  now: number,
  locked = false
) {
  const palette = getEnergyPalette(color);
  const pulse = Math.sin(now / 118) * 0.5 + 0.5;
  const violentPulse = Math.sin(now / 47) * 0.5 + 0.5;
  const coreRadius = (locked ? 26 : 18) + chargeProgress * 18 + pulse * 5;
  const auraRadius = (locked ? 96 : 76) + chargeProgress * 86 + pulse * 28;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  const aura = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, auraRadius);
  aura.addColorStop(0, "rgba(255, 255, 255, 0.86)");
  aura.addColorStop(0.1, palette.inner);
  aura.addColorStop(0.36, palette.middle);
  aura.addColorStop(1, palette.outer);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(point.x, point.y, auraRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = palette.flare;
  ctx.lineWidth = 2.5 + chargeProgress * 2;
  ctx.beginPath();
  ctx.arc(point.x, point.y, coreRadius + 24 + violentPulse * 7, -now / 220, Math.PI * 1.45 - now / 220);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(point.x, point.y, coreRadius + 40 + pulse * 10, now / 310, Math.PI * 1.25 + now / 310);
  ctx.stroke();

  for (let i = 0; i < 22; i += 1) {
    const angle = (Math.PI * 2 * i) / 22 + now / 380;
    const flicker = 0.45 + Math.abs(Math.sin(now / 53 + i * 1.7)) * 0.9;
    const inner = coreRadius * (1.04 + Math.sin(now / 80 + i) * 0.05);
    const outer = inner + (10 + chargeProgress * 26) * flicker;

    ctx.strokeStyle = palette.flare;
    ctx.globalAlpha = 0.22 + flicker * 0.32;
    ctx.lineWidth = 1 + flicker * 1.6;
    ctx.beginPath();
    ctx.moveTo(point.x + Math.cos(angle) * inner, point.y + Math.sin(angle) * inner);
    ctx.lineTo(point.x + Math.cos(angle) * outer, point.y + Math.sin(angle) * outer);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const plasma = ctx.createRadialGradient(point.x - 5, point.y - 6, 0, point.x, point.y, coreRadius * 1.65);
  plasma.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  plasma.addColorStop(0.2, palette.inner);
  plasma.addColorStop(0.52, palette.middle);
  plasma.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = plasma;
  ctx.beginPath();
  ctx.arc(point.x, point.y, coreRadius * 1.5, 0, Math.PI * 2);
  ctx.fill();

  const collapsedCore = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, coreRadius);
  collapsedCore.addColorStop(0, palette.core);
  collapsedCore.addColorStop(0.56, "rgba(20, 0, 28, 0.86)");
  collapsedCore.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = collapsedCore;
  ctx.beginPath();
  ctx.arc(point.x, point.y, coreRadius * 0.9, 0, Math.PI * 2);
  ctx.fill();

  if (locked) {
    ctx.strokeStyle = palette.flare;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(point.x, point.y, coreRadius + 18 + pulse * 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawAndUpdateParticles(
  ctx: CanvasRenderingContext2D,
  particles: EnergyParticle[],
  targets: Point[],
  now: number
) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    const target = targets[i % Math.max(targets.length, 1)];
    const palette = getEnergyPalette(particle.color ?? "red");

    particle.previousX = particle.x;
    particle.previousY = particle.y;

    const dx = target.x - particle.x;
    const dy = target.y - particle.y;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const pull = 0.026 + (1 - Math.min(dist / 190, 1)) * 0.13;

    particle.vx += (dx / dist) * pull;
    particle.vy += (dy / dist) * pull;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.982;
    particle.vy *= 0.982;
    particle.life -= dist < 16 ? 0.075 : 0.012;

    if (particle.life <= 0 || dist < 7) {
      particles.splice(i, 1);
      continue;
    }

    const speed = Math.min(Math.hypot(particle.vx, particle.vy), 10);
    ctx.strokeStyle = palette.particle;
    ctx.globalAlpha = particle.life * 0.58;
    ctx.lineWidth = particle.size;
    ctx.beginPath();
    ctx.moveTo(particle.previousX, particle.previousY);
    ctx.lineTo(particle.x - particle.vx * (1.8 + speed * 0.25), particle.y - particle.vy * (1.8 + speed * 0.25));
    ctx.stroke();

    const particleGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 4);
    particleGradient.addColorStop(0, `rgba(255, 255, 255, ${particle.life * 0.9})`);
    particleGradient.addColorStop(0.36, palette.particle);
    particleGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.restore();

  if (particles.length === 0 && targets.length > 0) {
    // Keep the orbit alive while the user is holding a charge.
    targets.forEach((target) => spawnInwardParticles(particles, target, "purple", 2));
  }
}

function spawnPurpleExplosion(particles: ScreenParticle[], point: Point, canvas: HTMLCanvasElement) {
  particles.length = 0;

  for (let i = 0; i < 620; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 12;
    particles.push({
      x: point.x + (Math.random() - 0.5) * 28,
      y: point.y + (Math.random() - 0.5) * 28,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5,
      vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 1.5,
      size: 2 + Math.random() * 5,
      life: 0.9 + Math.random() * 0.1,
      color: "purple",
      absorbing: false,
    });
  }

  // A few particles start near the screen edges so the detonation feels full-frame.
  for (let i = 0; i < 220; i += 1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2.2,
      vy: (Math.random() - 0.5) * 2.2,
      size: 1.5 + Math.random() * 3.5,
      life: 0.9,
      color: "purple",
      absorbing: false,
    });
  }
}

function drawScreenParticles(
  ctx: CanvasRenderingContext2D,
  particles: ScreenParticle[],
  openPalmPoint: Point | null,
  canvas: HTMLCanvasElement,
  extraction?: { point: Point; color: EnergyColor } | null
) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];

    if (openPalmPoint) {
      const dx = particle.x - openPalmPoint.x;
      const dy = particle.y - openPalmPoint.y;
      const dist = Math.max(Math.hypot(dx, dy), 1);

      if (dist < 190) {
        const force = (1 - dist / 190) * 0.95;
        particle.vx += (dx / dist) * force;
        particle.vy += (dy / dist) * force;
      }

      particle.life -= 0.012;
    }

    if (extraction) {
      const dx = extraction.point.x - particle.x;
      const dy = extraction.point.y - particle.y;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      const oppositeColor: EnergyColor = extraction.color === "red" ? "blue" : "red";

      if (particle.color === "purple" && dist < 380 && Math.random() < 0.055) {
        particles.push({
          x: particle.x + (Math.random() - 0.5) * 12,
          y: particle.y + (Math.random() - 0.5) * 12,
          vx: particle.vx * 0.45 + (Math.random() - 0.5) * 1.2,
          vy: particle.vy * 0.45 + (Math.random() - 0.5) * 1.2,
          size: Math.max(1.5, particle.size * 0.85),
          life: Math.max(0.55, particle.life * 0.9),
          color: oppositeColor,
          absorbing: false,
        });
        particle.color = extraction.color;
        particle.absorbing = true;
      }

      if (particle.color === extraction.color && dist < 380) {
        particle.absorbing = true;
      }

      if (particle.absorbing && particle.color === extraction.color) {
        const pull = 0.04 + (1 - Math.min(dist / 380, 1)) * 0.15;
        particle.vx += (dx / dist) * pull;
        particle.vy += (dy / dist) * pull;
        particle.life -= dist < 35 ? 0.03 : 0.002;
      }
    }

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.982;
    particle.vy *= 0.982;
    if (extraction && particle.absorbing && distance(particle, extraction.point) < 18) {
      particle.life -= 0.08;
    }

    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx *= -0.55;
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    }

    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy *= -0.55;
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
    }

    if (particle.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const palette = getEnergyPalette(particle.color ?? "purple");
    const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 5);
    glow.addColorStop(0, `rgba(255, 255, 255, ${particle.life})`);
    glow.addColorStop(0.25, palette.particle);
    glow.addColorStop(1, "rgba(88, 0, 160, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawHandSkeleton(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, landmarks: Landmark[]) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.fillStyle = "rgba(255,255,255,0.78)";

  HAND_CONNECTIONS.forEach(([start, end]) => {
    const a = landmarks[start];
    const b = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(canvas.width - a.x * canvas.width, a.y * canvas.height);
    ctx.lineTo(canvas.width - b.x * canvas.width, b.y * canvas.height);
    ctx.stroke();
  });

  landmarks.forEach((landmark, index) => {
    ctx.beginPath();
    ctx.arc(canvas.width - landmark.x * canvas.width, landmark.y * canvas.height, index === 8 || index === 4 ? 5 : 3.2, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawOrbRitualScene(
  canvas: HTMLCanvasElement,
  hands: TrackedHand[],
  ritual: OrbRitualState,
  particles: EnergyParticle[],
  screenParticles: ScreenParticle[],
  now: number
) {
  const ctx = getCanvasContext(canvas);
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hands.forEach((hand) => drawHandSkeleton(ctx, canvas, hand.landmarks));

  const openPalm = hands.find((hand) => hand.gesture === "open_palm");
  const extraction =
    ritual.phase === "red_charging" && ritual.redPoint
      ? { point: ritual.redPoint, color: "red" as const }
      : ritual.phase === "blue_charging" && ritual.bluePoint
        ? { point: ritual.bluePoint, color: "blue" as const }
        : null;

  if (screenParticles.length > 0) {
    drawScreenParticles(ctx, screenParticles, openPalm?.point ?? null, canvas, extraction);
  }

  if (ritual.phase === "exploded") {
    return;
  }

  const targets: Point[] = [];
  const redProgress = ritual.redStartedAt ? Math.min((now - ritual.redStartedAt) / CHARGE_DURATION, 1) : ritual.redPoint ? 1 : 0;
  const blueProgress = ritual.blueStartedAt ? Math.min((now - ritual.blueStartedAt) / CHARGE_DURATION, 1) : ritual.bluePoint ? 1 : 0;

  if (ritual.phase === "merging" && ritual.redPoint && ritual.bluePoint && ritual.purplePoint && ritual.combinedAt) {
    const mergeProgress = Math.min((now - ritual.combinedAt) / MERGE_DURATION, 1);
    const easedMerge = 1 - Math.pow(1 - mergeProgress, 3);
    const redMergePoint = lerpPoint(ritual.redPoint, ritual.purplePoint, easedMerge);
    const blueMergePoint = lerpPoint(ritual.bluePoint, ritual.purplePoint, easedMerge);

    spawnInwardParticles(particles, redMergePoint, "red", 2);
    spawnInwardParticles(particles, blueMergePoint, "blue", 2);
    spawnInwardParticles(particles, ritual.purplePoint, "purple", 3 + Math.floor(mergeProgress * 5));

    targets.push(redMergePoint, blueMergePoint, ritual.purplePoint);
    drawChargedOrb(ctx, redMergePoint, "red", 1 - mergeProgress * 0.65, now, true);
    drawChargedOrb(ctx, blueMergePoint, "blue", 1 - mergeProgress * 0.65, now, true);
    drawChargedOrb(ctx, ritual.purplePoint, "purple", mergeProgress * 1.28, now, mergeProgress > 0.9);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(220, 120, 255, ${0.2 + mergeProgress * 0.58})`;
    ctx.lineWidth = 2 + mergeProgress * 4;
    ctx.beginPath();
    ctx.moveTo(redMergePoint.x, redMergePoint.y);
    ctx.quadraticCurveTo(ritual.purplePoint.x, ritual.purplePoint.y - 70, blueMergePoint.x, blueMergePoint.y);
    ctx.stroke();
    ctx.restore();
  }

  if (ritual.redPoint && ["red_charging", "red_ready", "blue_charging", "blue_ready"].includes(ritual.phase)) {
    const redLocked = ritual.phase !== "red_charging";
    spawnInwardParticles(particles, ritual.redPoint, "red", redLocked ? 1 : 4);
    targets.push(ritual.redPoint);
    drawChargedOrb(ctx, ritual.redPoint, "red", redProgress, now, redLocked);
  }

  if (ritual.bluePoint && ["blue_charging", "blue_ready"].includes(ritual.phase)) {
    const blueLocked = ritual.phase !== "blue_charging";
    spawnInwardParticles(particles, ritual.bluePoint, "blue", blueLocked ? 1 : 4);
    targets.push(ritual.bluePoint);
    drawChargedOrb(ctx, ritual.bluePoint, "blue", blueProgress, now, blueLocked);
  }

  if (ritual.phase === "combined" && ritual.purplePoint) {
    spawnInwardParticles(particles, ritual.purplePoint, "purple", 7);
    targets.push(ritual.purplePoint);

    const combinedProgress = ritual.combinedAt ? Math.min((now - ritual.combinedAt) / 1600, 1) : 1;
    drawChargedOrb(ctx, ritual.purplePoint, "purple", 1.3 + combinedProgress * 0.2, now, true);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(215, 120, 255, ${0.25 + combinedProgress * 0.5})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(ritual.purplePoint.x, ritual.purplePoint.y, 90 + Math.sin(now / 90) * 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  if (targets.length > 0) {
    drawAndUpdateParticles(ctx, particles, targets, now);
  }
}

/** Filenames under /public/Images with spaces must be URL-encoded in URLs. */
function publicImage(file: string) {
  return `/Images/${encodeURIComponent(file)}`;
}

const RITUAL_STEPS_STATIC: ReadonlyArray<{ label: string; stickerSrc: string | null }> = [
  { label: "Point index", stickerSrc: publicImage("Frame 2147224939.png") },
  { label: "Second finger", stickerSrc: publicImage("Frame 2147224940.png") },
  { label: "Merge orbs", stickerSrc: publicImage("Frame 2147224941.png") },
  { label: "Pinch", stickerSrc: publicImage("Frame 2147224942.png") },
  { label: "Open palm", stickerSrc: null },
];

export function GestureCameraExperience() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const energyParticlesRef = useRef<EnergyParticle[]>([]);
  const screenParticlesRef = useRef<ScreenParticle[]>([]);
  const trackedHandsRef = useRef<TrackedHand[]>([]);
  const lastDetectionAtRef = useRef(0);
  const ritualRef = useRef<OrbRitualState>({
    phase: "idle",
    redStartedAt: null,
    blueStartedAt: null,
    redPoint: null,
    bluePoint: null,
    purplePoint: null,
    purpleAnchorPoint: null,
    combinedAt: null,
    explodedAt: null,
  });
  /** Synchronous guard — runDetection must not schedule RAF after stop/unmount (fixes orphan loops on refresh). */
  const isRunningRef = useRef(false);
  const isStartingRef = useRef(false);
  /** Bumps when stopping so any in-flight runDetection tail cannot schedule another RAF. */
  const rafEpochRef = useRef(0);
  const ritualPhaseRef = useRef<OrbPhase>("idle");
  const ritualProgressRef = useRef(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ritualPhase, setRitualPhase] = useState<OrbPhase>("idle");
  const [ritualProgress, setRitualProgress] = useState(0);

  const commitRitualPhase = useCallback((nextPhase: OrbPhase) => {
    if (ritualPhaseRef.current === nextPhase) {
      return;
    }

    ritualPhaseRef.current = nextPhase;
    setRitualPhase(nextPhase);
  }, []);

  const commitRitualProgress = useCallback((nextProgress: number, force = false) => {
    const clamped = Math.max(0, Math.min(nextProgress, 1));
    if (!force && Math.abs(ritualProgressRef.current - clamped) < RITUAL_PROGRESS_EPSILON) {
      return;
    }

    ritualProgressRef.current = clamped;
    setRitualProgress(clamped);
  }, []);

  /** Tear down streams/RAF without React updates — safe on unmount (avoids setState after unmount). */
  const disposeCameraResources = useCallback(() => {
    isRunningRef.current = false;
    isStartingRef.current = false;
    rafEpochRef.current += 1;

    if (animationFrameRef.current != null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const lm = landmarkerRef.current;
    if (lm && typeof lm.close === "function") {
      try {
        lm.close();
      } catch {
        /* ignore */
      }
    }
    landmarkerRef.current = null;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = getCanvasContext(canvasRef.current);
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    energyParticlesRef.current = [];
    screenParticlesRef.current = [];
    trackedHandsRef.current = [];
    lastDetectionAtRef.current = 0;
    canvasSizeRef.current = { width: 0, height: 0 };
    ritualRef.current = {
      phase: "idle",
      redStartedAt: null,
      blueStartedAt: null,
      redPoint: null,
      bluePoint: null,
      purplePoint: null,
      purpleAnchorPoint: null,
      combinedAt: null,
      explodedAt: null,
    };
  }, []);

  const stopCamera = useCallback(() => {
    disposeCameraResources();
    setIsRunning(false);
    ritualPhaseRef.current = "idle";
    ritualProgressRef.current = 0;
    setRitualPhase("idle");
    setRitualProgress(0);
  }, [disposeCameraResources]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const syncSize = () => {
      syncCanvasSize(canvas, videoRef.current, canvasSizeRef.current);
    };

    syncSize();

    const handleWindowResize = () => syncSize();
    window.addEventListener("resize", handleWindowResize);

    const video = videoRef.current;
    video?.addEventListener("loadedmetadata", syncSize);

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(() => syncSize());

    resizeObserver?.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      video?.removeEventListener("loadedmetadata", syncSize);
      resizeObserver?.disconnect();
    };
  }, []);

  const runDetection = useCallback(() => {
    const epoch = rafEpochRef.current;

    const scheduleNext = () => {
      if (!isRunningRef.current || epoch !== rafEpochRef.current) {
        animationFrameRef.current = null;
        return;
      }
      animationFrameRef.current = requestAnimationFrame(runDetection);
    };

    if (!isRunningRef.current) {
      animationFrameRef.current = null;
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !canvas || !landmarker || video.readyState < 2) {
      scheduleNext();
      return;
    }

    const now = performance.now();
    syncCanvasSize(canvas, video, canvasSizeRef.current);

    if (lastDetectionAtRef.current === 0 || now - lastDetectionAtRef.current >= DETECTION_INTERVAL_MS) {
      const results = landmarker.detectForVideo(video, now);
      const detectedHands = (results.landmarks ?? []) as Landmark[][];

      trackedHandsRef.current = detectedHands
        .map((handLandmarks) => ({
          landmarks: handLandmarks,
          gesture: detectGesture(handLandmarks),
          point: toCanvasPoint(canvas, handLandmarks[8]),
          depth: getFingerDepth(handLandmarks),
        }))
        .sort((a, b) => a.point.x - b.point.x);

      lastDetectionAtRef.current = now;
    }

    const hands = trackedHandsRef.current;

    if (hands.length === 0) {
      const ctx = getCanvasContext(canvas);
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (screenParticlesRef.current.length > 0) {
          drawScreenParticles(ctx, screenParticlesRef.current, null, canvas);
        }
      }
      scheduleNext();
      return;
    }

    const ritual = ritualRef.current;
    const pointingHands = hands.filter((hand) => hand.gesture === "point");
    const pinchHands = hands.filter((hand) => hand.gesture === "pinch");
    let nextProgress = 0;

    if (ritual.phase === "exploded" && screenParticlesRef.current.length < 12) {
      ritual.phase = "idle";
      ritual.redStartedAt = null;
      ritual.blueStartedAt = null;
      ritual.redPoint = null;
      ritual.bluePoint = null;
      ritual.purplePoint = null;
      ritual.purpleAnchorPoint = null;
      ritual.combinedAt = null;
      ritual.explodedAt = null;
    }

    if ((ritual.phase === "idle" || ritual.phase === "exploded") && pointingHands[0]) {
      ritual.phase = "red_charging";
      ritual.redStartedAt = now;
      ritual.blueStartedAt = null;
      ritual.redPoint = pointingHands[0].point;
      ritual.bluePoint = null;
      ritual.purplePoint = null;
      ritual.purpleAnchorPoint = null;
      ritual.combinedAt = null;
    }

    if (ritual.phase === "red_charging") {
      const redHand = findClosestHand(pointingHands, ritual.redPoint, 190) ?? pointingHands[0];
      if (redHand) {
        ritual.redPoint = redHand.point;
      } else {
        ritual.phase = "idle";
        ritual.redStartedAt = null;
        ritual.redPoint = null;
      }

      if (ritual.redStartedAt && now - ritual.redStartedAt >= CHARGE_DURATION) {
        ritual.phase = "red_ready";
        ritual.redStartedAt = null;
      }
    }

    if (["red_ready", "blue_charging", "blue_ready"].includes(ritual.phase) && ritual.redPoint) {
      const redTrackingHand = findClosestHand(hands, ritual.redPoint, 230);
      if (redTrackingHand) {
        ritual.redPoint = redTrackingHand.point;
      }
    }

    if (ritual.phase === "red_ready" && ritual.redPoint) {
      const nextBlueHand = pointingHands.find((hand) => !isSamePointingHand(hand, ritual.redPoint, 170));
      if (nextBlueHand) {
        ritual.phase = "blue_charging";
        ritual.blueStartedAt = now;
        ritual.bluePoint = nextBlueHand.point;
      }
    }

    if (ritual.phase === "blue_charging") {
      const blueHand =
        findClosestHand(pointingHands.filter((hand) => !isSamePointingHand(hand, ritual.redPoint, 170)), ritual.bluePoint, 210) ??
        pointingHands.find((hand) => !isSamePointingHand(hand, ritual.redPoint, 170));
      if (blueHand) {
        ritual.bluePoint = blueHand.point;
      } else {
        ritual.phase = "red_ready";
        ritual.blueStartedAt = null;
        ritual.bluePoint = null;
      }

      if (ritual.blueStartedAt && now - ritual.blueStartedAt >= CHARGE_DURATION) {
        ritual.phase = "blue_ready";
        ritual.blueStartedAt = null;
      }
    }

    if (ritual.phase === "blue_ready" && ritual.redPoint && ritual.bluePoint) {
      const redTrackingHand = findClosestHand(hands, ritual.redPoint, 230);
      const blueTrackingHand =
        findClosestHand(hands.filter((hand) => hand !== redTrackingHand), ritual.bluePoint, 230) ??
        findClosestHand(pointingHands.filter((hand) => !isSamePointingHand(hand, ritual.redPoint, 170)), ritual.bluePoint, 230);

      if (redTrackingHand) ritual.redPoint = redTrackingHand.point;
      if (blueTrackingHand) ritual.bluePoint = blueTrackingHand.point;

      const orbDistance = distance(ritual.redPoint, ritual.bluePoint);
      if (orbDistance < 120) {
        const mergeHands = pointingHands
          .filter((hand) => distance(hand.point, ritual.redPoint as Point) < 150 || distance(hand.point, ritual.bluePoint as Point) < 150)
          .sort((a, b) => a.depth - b.depth);
        const anchorHand = mergeHands[0] ?? pointingHands[0];

        ritual.phase = "merging";
        ritual.combinedAt = now;
        ritual.purpleAnchorPoint = anchorHand?.point ?? ritual.redPoint;
        ritual.purplePoint = ritual.purpleAnchorPoint;
        ritual.redStartedAt = null;
        ritual.blueStartedAt = null;
      }
    }

    if (ritual.phase === "merging" && ritual.combinedAt) {
      const anchorHand =
        hands.find((hand) => isSamePointingHand(hand, ritual.purpleAnchorPoint, 190)) ??
        hands.find((hand) => isSamePointingHand(hand, ritual.purplePoint, 210));

      if (anchorHand) {
        ritual.purpleAnchorPoint = anchorHand.point;
        ritual.purplePoint = anchorHand.point;
      }

      if (now - ritual.combinedAt >= MERGE_DURATION) {
        ritual.phase = "combined";
        ritual.redPoint = null;
        ritual.bluePoint = null;
      }
    }

    if (ritual.phase === "combined") {
      const anchorHand =
        hands.find((hand) => isSamePointingHand(hand, ritual.purpleAnchorPoint, 170)) ??
        hands.find((hand) => isSamePointingHand(hand, ritual.purplePoint, 190));

      if (anchorHand) {
        ritual.purpleAnchorPoint = anchorHand.point;
        ritual.purplePoint = anchorHand.point;
      }

      const anchorPinch = pinchHands.find((hand) => isSamePointingHand(hand, ritual.purpleAnchorPoint, 170));
      if (anchorPinch && ritual.purplePoint) {
        ritual.phase = "exploded";
        ritual.explodedAt = now;
        spawnPurpleExplosion(screenParticlesRef.current, ritual.purplePoint, canvas);
      }
    }

    drawOrbRitualScene(canvas, hands, ritual, energyParticlesRef.current, screenParticlesRef.current, now);

    if (ritual.phase === "red_charging" && ritual.redStartedAt) {
      nextProgress = Math.min((now - ritual.redStartedAt) / CHARGE_DURATION, 1);
    } else if (ritual.phase === "red_ready") {
      nextProgress = 1;
    } else if (ritual.phase === "blue_charging" && ritual.blueStartedAt) {
      nextProgress = Math.min((now - ritual.blueStartedAt) / CHARGE_DURATION, 1);
    } else if (ritual.phase === "blue_ready") {
      nextProgress = 1;
    } else if (ritual.phase === "merging") {
      nextProgress = ritual.combinedAt ? Math.min((now - ritual.combinedAt) / MERGE_DURATION, 1) : 0;
    } else if (ritual.phase === "combined") {
      nextProgress = 1;
    } else if (ritual.phase === "exploded") {
      nextProgress = 1;
    }

    const phaseChanged = ritual.phase !== ritualPhaseRef.current;
    commitRitualPhase(ritual.phase);
    commitRitualProgress(nextProgress, phaseChanged || nextProgress === 0 || nextProgress === 1);

    scheduleNext();
  }, [commitRitualPhase, commitRitualProgress]);

  const startCamera = async () => {
    if (isRunningRef.current || isStartingRef.current) {
      return;
    }
    isStartingRef.current = true;
    try {
      setIsLoading(true);

      if (!landmarkerRef.current) {
        const { FilesetResolver, HandLandmarker } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
        );
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          aspectRatio: { ideal: 16 / 9 },
          frameRate: { ideal: 30, max: 30 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      trackedHandsRef.current = [];
      lastDetectionAtRef.current = 0;
      if (canvasRef.current) {
        syncCanvasSize(canvasRef.current, videoRef.current, canvasSizeRef.current);
      }

      isRunningRef.current = true;
      setIsRunning(true);
      animationFrameRef.current = requestAnimationFrame(runDetection);
    } catch (error) {
      console.error(error);
      stopCamera();
    } finally {
      setIsLoading(false);
      isStartingRef.current = false;
    }
  };

  useEffect(() => {
    return () => disposeCameraResources();
  }, [disposeCameraResources]);

  const guide = getRitualGuide(ritualPhase, ritualProgress);

  const activePillIndex =
    ritualPhase === "idle" || ritualPhase === "red_charging" ? 0
    : ritualPhase === "red_ready" || ritualPhase === "blue_charging" ? 1
    : ritualPhase === "blue_ready" || ritualPhase === "merging" ? 2
    : ritualPhase === "combined" ? 3
    : 4;

  const phaseGlow =
    guide.tone === "red" ? "239,68,68"
    : guide.tone === "blue" ? "56,189,248"
    : guide.tone === "purple" ? "217,70,239"
    : "255,255,255";

  const showPowerBar =
    isLoading || (isRunning && (ritualPhase === "red_charging" || ritualPhase === "blue_charging"));

  const powerBarLabel = isLoading
    ? "Powering up…"
    : ritualPhase === "red_charging"
      ? "Red orb — charge"
      : "Blue orb — charge";

  const powerBarTone = ritualPhase === "blue_charging" ? "blue" : "red";
  const powerBarPercent = Math.round(ritualProgress * 100);
  const isWorldReleased = ritualPhase === "exploded";

  const phaseChipTop =
    isRunning && ritualPhase !== "idle" && showPowerBar
      ? "top-[4.25rem] sm:top-[4.5rem]"
      : "top-12 sm:top-14";

  /* clamp + non-negative calc: short viewports used to make min(28vh, 100svh-200px)
     negative/tiny; inner layer is h-full with only abs children → 0px tall → blank UI */
  const experienceFrameStyle = {
    height: "min(545px, max(300px, calc(100svh - 345px)))",
    minHeight: 300,
    maxHeight: 560,
    width: "100%",
  } as const;

  return (
    <div
      className={`gesture-camera-root relative h-svh w-full overflow-hidden text-[#F5F7FF] ${
        isWorldReleased ? "limitless-release" : ""
      }`}
      style={{
        color: "#F5F7FF",
        fontFamily: '"Space Grotesk", "Satoshi", "General Sans", Inter, system-ui, sans-serif',
      } as CSSProperties}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[#02030A] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/Images/wp9267744-stars-4k-dark-wallpapers.jpg)" }}
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1240px] flex-col px-4 pb-3 pt-[6.2rem] sm:px-6 sm:pb-4 md:pt-[6.35rem]">
        <section className="relative z-10 h-[129px] shrink-0 text-center">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-[min(70vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(77,163,255,0.12),rgba(155,92,255,0.08)_42%,transparent_72%)] blur-[120px] opacity-[0.17]" />
          <div className="relative mx-auto max-w-[920px]">
            <div className="mb-1.5 flex items-center justify-center gap-3 text-[9px] font-black uppercase leading-none tracking-[0.34em] text-[#9AA4C7]">
              <span className="h-px w-9 bg-gradient-to-r from-transparent via-[#4DA3FF] to-[#9B5CFF]" />
              <span>Domain Expansion</span>
              <span className="font-mono tracking-[0.22em] text-[#5F698A]">領域展開</span>
              <span className="h-px w-9 bg-gradient-to-r from-[#9B5CFF] via-[#4DA3FF] to-transparent" />
            </div>
            <h1
              aria-label="Turning Anime Into Interaction"
              className="limitless-heading text-balance text-[48px] font-extrabold uppercase !leading-[0.9] tracking-[-0.05em] !text-[#F5F7FF]"
            >
              Turning Anime Into{" "}
              <span className="inline-block bg-[linear-gradient(135deg,#4DA3FF_0%,#9B5CFF_100%)] bg-clip-text text-transparent">
                Interaction
              </span>
            </h1>
            <p className="mx-auto mt-2 max-w-[660px] text-[16px] leading-5 !text-[#9AA4C7]">
              Hand tracking transforms gestures into cursed energy interactions inspired by Hollow Purple.
            </p>
          </div>
          <div aria-hidden className="pointer-events-none mx-auto mt-2 h-[54px] w-px bg-gradient-to-b from-[#4DA3FF]/[0.09] via-[#9B5CFF]/[0.07] to-transparent" />
        </section>

        <section className="relative z-20 mt-3 min-h-0 flex-1 overflow-visible" aria-label="Camera experience">
        <div className="mx-auto h-full w-full max-w-[1120px] overflow-visible">
          <div className="relative flex h-fit w-full items-center justify-center overflow-visible px-0 sm:px-10 lg:px-14">
            <div
              className="limitless-chamber group relative isolate min-h-[300px] w-full overflow-hidden rounded-[20px] bg-[rgba(8,10,20,0.55)] backdrop-blur-[14px] transition-transform duration-500 ease-out will-change-transform hover:scale-[1.006]"
              style={{
                ...experienceFrameStyle,
                boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 46px rgba(77,163,255,0.08), 0 0 62px rgba(155,92,255,0.07)`,
              }}
            >
            <div className="pointer-events-none absolute -inset-16 z-[3] bg-[radial-gradient(circle_at_12%_50%,rgba(77,163,255,0.08),transparent_36%),radial-gradient(circle_at_88%_46%,rgba(155,92,255,0.08),transparent_38%)]" />
            <div className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(circle_at_50%_42%,transparent_0%,transparent_46%,rgba(77,163,255,0.045)_76%,rgba(155,92,255,0.045)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-14 bg-gradient-to-b from-[#F5F7FF]/[0.032] to-transparent" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[4] opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, rgba(154,164,199,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(154,164,199,0.8) 1px, transparent 1px)",
                backgroundSize: "42px 42px",
              }}
            />

            {isRunning && (
              <button
                type="button"
                onClick={stopCamera}
                className={`absolute right-3 z-[55] rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85 backdrop-blur-md transition-colors hover:bg-black/90 ${
                  showPowerBar ? "top-[3.6rem]" : "top-3"
                }`}
              >
                Stop
              </button>
            )}

            <div className="absolute inset-0 min-h-0 w-full bg-neutral-950">
              <video
                ref={videoRef}
                className="camera-feed-cinematic absolute inset-0 h-full w-full scale-x-[-1] object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
              <div aria-hidden className="film-grain pointer-events-none absolute inset-0 z-[2] opacity-[0.055]" />
              <div aria-hidden className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_45%,transparent_0%,transparent_58%,rgba(77,163,255,0.045)_100%)] mix-blend-screen" />

              {/* Game-style power bar — boot + red/blue charge */}
              {showPowerBar && (
                <div
                  className={`pointer-events-none absolute left-3 top-3 z-30 ${isRunning ? "right-[4.85rem] sm:right-[5.65rem]" : "right-3"}`}
                >
                  <div className="mb-2 flex items-end justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-white/60">
                      <span
                        className={`h-1.5 w-1.5 rounded-full shadow-[0_0_12px_currentColor] ${
                          isLoading
                            ? "bg-fuchsia-300 text-fuchsia-300"
                            : powerBarTone === "red"
                              ? "bg-rose-300 text-rose-300"
                              : "bg-sky-300 text-sky-300"
                        }`}
                      />
                      {powerBarLabel}
                    </span>
                    {!isLoading && (
                      <span className="font-mono text-[10px] tabular-nums text-white/60">
                        {powerBarPercent}%
                      </span>
                    )}
                  </div>
                  <div
                    className="relative h-4 overflow-hidden rounded-sm border border-white/15 bg-black/75 shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
                    style={{
                      boxShadow: `0 0 22px rgba(${phaseGlow}, 0.16), 0 0 0 1px rgba(255,255,255,0.04) inset`,
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="absolute inset-0 bg-white/[0.04]" />
                        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent opacity-95 animate-ritual-boot-sweep" />
                      </>
                    ) : (
                      <>
                        <div
                          className={`absolute inset-y-0 left-0 w-full origin-left transition-transform duration-75 ease-linear ${
                            powerBarTone === "red"
                              ? "bg-gradient-to-r from-rose-700 via-rose-400 to-orange-300 shadow-[0_0_14px_rgba(239,68,68,0.65)]"
                              : "bg-gradient-to-r from-sky-700 via-sky-400 to-cyan-200 shadow-[0_0_14px_rgba(56,189,248,0.65)]"
                          }`}
                          style={{ transform: `scaleX(${ritualProgress})` }}
                        />
                        <div
                          aria-hidden
                          className="absolute inset-0 opacity-45"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, rgba(255,255,255,0.18) 0 1px, transparent 1px)",
                            backgroundSize: "14.285% 100%",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/14 to-transparent animate-ritual-cell-spark opacity-45" />
                      </>
                    )}
                  </div>
                </div>
              )}

              {isRunning && ritualPhase !== "idle" && (
                <div className={`pointer-events-none absolute left-3 z-20 sm:left-4 ${phaseChipTop}`}>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] backdrop-blur-md sm:px-3 sm:py-1 sm:text-[10px] ${
                      guide.tone === "red"
                        ? "border-rose-500/35 bg-rose-950/65 text-rose-300"
                        : guide.tone === "blue"
                          ? "border-sky-500/35 bg-sky-950/65 text-sky-300"
                          : guide.tone === "purple"
                            ? "border-fuchsia-500/35 bg-fuchsia-950/65 text-fuchsia-300"
                            : "border-white/10 bg-black/55 text-white/40"
                    }`}
                  >
                    {guide.eyebrow}
                  </span>
                </div>
              )}

              {!isRunning && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#02030A]/72 !text-[#F5F7FF] text-[#F5F7FF] backdrop-blur-[2px]">
                  <div className="mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1rem] border border-[#9B5CFF]/30 bg-[rgba(10,12,28,0.72)] shadow-[0_0_34px_rgba(155,92,255,0.24)]">
                    <Camera className="h-8 w-8 text-[#9AA4C7]" />
                  </div>
                  <h3 className="mb-2 text-lg font-black uppercase !text-[#F5F7FF] tracking-normal">Hollow Purple Move</h3>
                  <p className="mb-6 max-w-[360px] px-4 text-center text-[12px] leading-relaxed !text-[#9AA4C7]">
                    Camera runs entirely in your browser. Hand tracking never leaves your device.
                  </p>
                  <button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#4DA3FF_0%,#9B5CFF_55%,#C86BFF_100%)] px-6 py-2.5 text-[13px] font-black text-[#F5F7FF] shadow-[0_14px_34px_rgba(155,92,255,0.32)] transition-transform duration-300 hover:scale-[1.025] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                    {isLoading ? "Starting…" : "Start camera"}
                  </button>
                </div>
              )}

              {/* Combined ritual strip — always visible; sits above idle overlay */}
              <div className="pointer-events-none absolute bottom-2 left-1/2 z-[60] w-[calc(100%-0.85rem)] max-w-[760px] -translate-x-1/2 px-0.5 sm:bottom-3">
                <div className="mx-auto flex items-stretch justify-center gap-1 overflow-x-auto rounded-[14px] border border-white/[0.06] bg-[rgba(15,18,30,0.45)] px-1.5 py-1 shadow-none backdrop-blur-[18px] sm:gap-1.5 sm:px-2 sm:py-1">
                  {RITUAL_STEPS_STATIC.map((step, i) => {
                    const isStepActive = isRunning && i === activePillIndex;
                    const isIdleHint = !isRunning && i === 0;
                    return (
                      <div
                        key={step.label}
                        className={`flex min-w-0 shrink-0 items-center gap-1.5 px-1 py-0.5 transition-all duration-300 ease-out sm:gap-2 sm:px-2 ${
                          isStepActive
                            ? "scale-[1.05]"
                            : isIdleHint
                              ? "opacity-80"
                              : isRunning
                                ? "opacity-35"
                                : "opacity-55"
                        }`}
                      >
                        <div
                          className={`relative h-6 w-6 shrink-0 overflow-hidden rounded-full border sm:h-7 sm:w-7 ${
                            isStepActive
                              ? "border-[#C86BFF]/80 shadow-[0_0_16px_rgba(155,92,255,0.32)] ring-1 ring-[#4DA3FF]/25"
                              : isIdleHint
                                ? "border-[#F5F7FF]/22"
                                : "border-[#F5F7FF]/10"
                          }`}
                        >
                          {step.stickerSrc ? (
                            <img
                              src={step.stickerSrc}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover"
                              width={36}
                              height={36}
                              decoding="async"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-white/10">
                              <Camera className="h-3.5 w-3.5 text-[#9AA4C7]" />
                            </div>
                          )}
                        </div>
                        <span className="max-w-[52px] truncate text-[7px] font-semibold leading-tight text-[#F5F7FF]/76 sm:max-w-[72px] sm:text-[9px]">
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

            {/* Reference clip — small titled rectangle; outside frame clip, straddles top-right corner */}
            <div className="hologram-card pointer-events-none absolute -right-1 top-2 z-[70] w-[min(38vw,190px)] max-w-[190px] rotate-[6deg] overflow-hidden rounded-[0.85rem] border border-[#F5F7FF]/16 bg-[rgba(10,12,28,0.55)] shadow-[0_20px_54px_rgba(0,0,0,0.5)] backdrop-blur-md sm:-right-3 sm:-top-1 sm:max-w-[210px] sm:rotate-[5deg] lg:-right-2">
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#02030A]/38 to-transparent" />
              <div className="pointer-events-none absolute inset-0 z-[2] border border-[#4DA3FF]/10" />
              <span className="absolute left-2 top-2 z-[3] text-[7px] font-black uppercase tracking-[0.26em] text-[#9AA4C7]/70">
                Ref
              </span>
              <video
                className="aspect-video w-full object-cover opacity-95"
                src="/Images/hollow-purple-reference.mov"
                preload="none"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </div>
        </section>
      </div>
    </div>
  );
}
