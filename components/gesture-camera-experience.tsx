"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Hand, MousePointer2, Pause, Sparkles, Waves } from "lucide-react";
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

type EnergyBurst = {
  x: number;
  y: number;
  startedAt: number;
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

const CHARGE_DURATION = 3500;
const MERGE_DURATION = 2200;

const GESTURE_ACTIONS: Record<
  Exclude<GestureKey, "none">,
  {
    label: string;
    instruction: string;
    result: string;
    icon: typeof Hand;
  }
> = {
  open_palm: {
    label: "Open Palm",
    instruction: "Show your full hand",
    result: "Reveal content",
    icon: Sparkles,
  },
  pinch: {
    label: "Pinch",
    instruction: "Touch index finger and thumb",
    result: "Select item",
    icon: MousePointer2,
  },
  point: {
    label: "Point",
    instruction: "Raise only your index finger",
    result: "Charge energy orb",
    icon: Hand,
  },
  fist: {
    label: "Fist",
    instruction: "Close your hand",
    result: "Pause interaction",
    icon: Pause,
  },
  swipe_left: {
    label: "Swipe Left",
    instruction: "Move your hand left",
    result: "Previous card",
    icon: Waves,
  },
  swipe_right: {
    label: "Swipe Right",
    instruction: "Move your hand right",
    result: "Next card",
    icon: Waves,
  },
};

const ACTION_ORDER: Exclude<GestureKey, "none">[] = ["open_palm", "pinch", "point", "fist"];

const RITUAL_ACTIONS = [
  {
    title: "Point index finger",
    body: "Hold one index finger steady for 7 seconds to charge the red orb.",
    icon: Hand,
  },
  {
    title: "Raise other finger",
    body: "After red locks, use your other index finger to charge the blue orb.",
    icon: Sparkles,
  },
  {
    title: "Bring fingers close",
    body: "Move both charged fingers together to blend red and blue into purple.",
    icon: Waves,
  },
  {
    title: "Pinch / open palm",
    body: "Pinch the purple hand to explode. Show full hand to clear particles.",
    icon: MousePointer2,
  },
];

function getRitualGuide(phase: OrbPhase, progress: number) {
  if (phase === "red_charging") {
    return {
      eyebrow: "Step 01",
      title: `Charging red orb (${Math.min(Math.floor(progress * 7), 7)} / 7 cells)`,
      body: "Keep this index finger steady. If you remove it before 7 seconds, the red charge resets.",
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
      title: `Charging blue orb (${Math.min(Math.floor(progress * 7), 7)} / 7 cells)`,
      body: "Hold the second finger steady for the full 7 seconds. Removing it resets blue only.",
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

function detectGesture(landmarks: Landmark[], wristHistory: number[]): GestureKey {
  const indexExtended = isFingerExtended(landmarks, 8, 6);
  const middleExtended = isFingerExtended(landmarks, 12, 10);
  const ringExtended = isFingerExtended(landmarks, 16, 14);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18);
  const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;
  const pinchDistance = distance(landmarks[4], landmarks[8]);

  if (wristHistory.length >= 8) {
    const movement = wristHistory[wristHistory.length - 1] - wristHistory[0];
    if (movement > 0.22) return "swipe_right";
    if (movement < -0.22) return "swipe_left";
  }

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

function drawEnergyOrb(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  fingerTip: Landmark,
  gesture: GestureKey,
  particles: EnergyParticle[],
  bursts: EnergyBurst[],
  now: number
) {
  const x = canvas.width - fingerTip.x * canvas.width;
  const y = fingerTip.y * canvas.height;
  const orbActive = gesture === "point" || gesture === "pinch";

  if (orbActive) {
    for (let i = 0; i < 5; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 72 + Math.random() * 120;
      const particleX = x + Math.cos(angle) * radius;
      const particleY = y + Math.sin(angle) * radius;

      particles.push({
        x: particleX,
        y: particleY,
        previousX: particleX,
        previousY: particleY,
        vx: Math.cos(angle + Math.PI) * (0.6 + Math.random() * 1.2),
        vy: Math.sin(angle + Math.PI) * (0.6 + Math.random() * 1.2),
        life: 1,
        size: 1.5 + Math.random() * 3.5,
      });
    }

    if (particles.length > 150) {
      particles.splice(0, particles.length - 150);
    }
  }

  ctx.save();

  if (orbActive) {
    const warpPulse = Math.sin(now / 170) * 0.5 + 0.5;

    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = `rgba(255, 20, 70, ${0.08 + warpPulse * 0.08})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(x, y, 72 + i * 30 + warpPulse * 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    const compressedAir = ctx.createRadialGradient(x, y, 12, x, y, 170);
    compressedAir.addColorStop(0, "rgba(40, 0, 8, 0)");
    compressedAir.addColorStop(0.45, "rgba(255, 0, 58, 0.06)");
    compressedAir.addColorStop(0.72, "rgba(0, 0, 0, 0.18)");
    compressedAir.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = compressedAir;
    ctx.beginPath();
    ctx.arc(x, y, 175, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = "lighter";

  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.previousX = particle.x;
    particle.previousY = particle.y;

    const dx = x - particle.x;
    const dy = y - particle.y;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const pull = 0.028 + (1 - Math.min(dist / 190, 1)) * 0.14;

    particle.vx += (dx / dist) * pull;
    particle.vy += (dy / dist) * pull;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.982;
    particle.vy *= 0.982;
    particle.life -= dist < 20 ? 0.11 : 0.018;

    if (particle.life <= 0 || dist < 8) {
      particles.splice(i, 1);
      continue;
    }

    const speed = Math.min(Math.hypot(particle.vx, particle.vy), 9);
    ctx.strokeStyle = `rgba(255, 42, 84, ${particle.life * 0.52})`;
    ctx.lineWidth = particle.size;
    ctx.beginPath();
    ctx.moveTo(particle.previousX, particle.previousY);
    ctx.lineTo(particle.x - particle.vx * (1.8 + speed * 0.25), particle.y - particle.vy * (1.8 + speed * 0.25));
    ctx.stroke();

    const particleGradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size * 4
    );
    particleGradient.addColorStop(0, `rgba(255, 255, 255, ${particle.life * 0.9})`);
    particleGradient.addColorStop(0.28, `rgba(255, 20, 65, ${particle.life * 0.82})`);
    particleGradient.addColorStop(1, "rgba(80, 0, 16, 0)");
    ctx.fillStyle = particleGradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = bursts.length - 1; i >= 0; i -= 1) {
    const burst = bursts[i];
    const progress = (now - burst.startedAt) / 700;

    if (progress >= 1) {
      bursts.splice(i, 1);
      continue;
    }

    const alpha = 1 - progress;
    const radius = 22 + progress * 120;

    ctx.strokeStyle = `rgba(255, 70, 130, ${alpha * 0.75})`;
    ctx.lineWidth = 5 - progress * 3;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, radius * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (orbActive) {
    const pulse = Math.sin(now / 118) * 0.5 + 0.5;
    const violentPulse = Math.sin(now / 47) * 0.5 + 0.5;
    const charge = Math.min(particles.length / 130, 1);
    const coreRadius = gesture === "pinch" ? 34 : 18 + charge * 12 + pulse * 5;
    const auraRadius = gesture === "pinch" ? 132 : 76 + charge * 62 + pulse * 28;

    const aura = ctx.createRadialGradient(x, y, 0, x, y, auraRadius);
    aura.addColorStop(0, "rgba(255, 245, 245, 0.86)");
    aura.addColorStop(0.08, "rgba(255, 33, 74, 0.86)");
    aura.addColorStop(0.32, "rgba(210, 0, 42, 0.58)");
    aura.addColorStop(0.68, "rgba(75, 0, 16, 0.24)");
    aura.addColorStop(1, "rgba(10, 0, 0, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x, y, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 24, 66, ${0.42 + pulse * 0.28})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, coreRadius + 22 + violentPulse * 5, -now / 220, Math.PI * 1.45 - now / 220);
    ctx.stroke();

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 + violentPulse * 0.32})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, coreRadius + 38 + pulse * 8, now / 310, Math.PI * 1.25 + now / 310);
    ctx.stroke();

    for (let i = 0; i < 18; i += 1) {
      const angle = (Math.PI * 2 * i) / 18 + now / 380;
      const flicker = 0.45 + Math.abs(Math.sin(now / 53 + i * 1.7)) * 0.9;
      const inner = coreRadius * (1.04 + Math.sin(now / 80 + i) * 0.05);
      const outer = inner + (12 + charge * 18) * flicker;

      ctx.strokeStyle = `rgba(255, ${24 + i * 3}, ${54 + i * 2}, ${0.2 + flicker * 0.32})`;
      ctx.lineWidth = 1 + flicker * 1.4;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
      ctx.lineTo(x + Math.cos(angle) * outer, y + Math.sin(angle) * outer);
      ctx.stroke();
    }

    const plasma = ctx.createRadialGradient(x - 5, y - 6, 0, x, y, coreRadius * 1.55);
    plasma.addColorStop(0, "rgba(255, 242, 242, 0.96)");
    plasma.addColorStop(0.18, "rgba(255, 36, 77, 0.92)");
    plasma.addColorStop(0.48, "rgba(120, 0, 25, 0.88)");
    plasma.addColorStop(0.73, "rgba(255, 12, 48, 0.68)");
    plasma.addColorStop(1, "rgba(70, 0, 12, 0)");
    ctx.fillStyle = plasma;
    ctx.beginPath();
    ctx.arc(x, y, coreRadius * 1.45, 0, Math.PI * 2);
    ctx.fill();

    const collapsedCore = ctx.createRadialGradient(x, y, 0, x, y, coreRadius);
    collapsedCore.addColorStop(0, "rgba(5, 0, 2, 0.98)");
    collapsedCore.addColorStop(0.42, "rgba(34, 0, 8, 0.95)");
    collapsedCore.addColorStop(0.7, "rgba(110, 0, 22, 0.55)");
    collapsedCore.addColorStop(1, "rgba(255, 20, 56, 0)");
    ctx.fillStyle = collapsedCore;
    ctx.beginPath();
    ctx.arc(x, y, coreRadius * 0.88, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(0, 0, 0, ${0.45 + charge * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y, coreRadius * 0.34, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawLandmarks(
  canvas: HTMLCanvasElement,
  landmarks: Landmark[],
  gesture: GestureKey,
  particles: EnergyParticle[],
  bursts: EnergyBurst[],
  now: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.fillStyle = "rgba(255,255,255,0.92)";

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17],
  ];

  connections.forEach(([start, end]) => {
    const a = landmarks[start];
    const b = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(canvas.width - a.x * canvas.width, a.y * canvas.height);
    ctx.lineTo(canvas.width - b.x * canvas.width, b.y * canvas.height);
    ctx.stroke();
  });

  landmarks.forEach((landmark, index) => {
    ctx.beginPath();
    ctx.arc(canvas.width - landmark.x * canvas.width, landmark.y * canvas.height, index === 8 || index === 4 ? 5 : 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  drawEnergyOrb(ctx, canvas, landmarks[8], gesture, particles, bursts, now);
}

function drawHandSkeleton(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, landmarks: Landmark[]) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.fillStyle = "rgba(255,255,255,0.78)";

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17],
  ];

  connections.forEach(([start, end]) => {
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
  const ctx = canvas.getContext("2d");
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
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const wristHistoryRef = useRef<number[]>([]);
  const energyParticlesRef = useRef<EnergyParticle[]>([]);
  const energyBurstsRef = useRef<EnergyBurst[]>([]);
  const screenParticlesRef = useRef<ScreenParticle[]>([]);
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
  const lastGestureRef = useRef<GestureKey>("none");
  const lastTriggerRef = useRef(0);
  /** Synchronous guard — runDetection must not schedule RAF after stop/unmount (fixes orphan loops on refresh). */
  const isRunningRef = useRef(false);
  const isStartingRef = useRef(false);
  /** Bumps when stopping so any in-flight runDetection tail cannot schedule another RAF. */
  const rafEpochRef = useRef(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("Camera is off. Start the demo to begin hand tracking.");
  const [gesture, setGesture] = useState<GestureKey>("none");
  const [activeAction, setActiveAction] = useState<Exclude<GestureKey, "none">>("open_palm");
  const [eventCount, setEventCount] = useState(0);
  const [ritualPhase, setRitualPhase] = useState<OrbPhase>("idle");
  const [ritualProgress, setRitualProgress] = useState(0);

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
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    wristHistoryRef.current = [];
    energyParticlesRef.current = [];
    energyBurstsRef.current = [];
    screenParticlesRef.current = [];
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
    lastGestureRef.current = "none";
  }, []);

  const stopCamera = useCallback(() => {
    disposeCameraResources();
    setIsRunning(false);
    setGesture("none");
    setRitualPhase("idle");
    setRitualProgress(0);
    setStatus("Camera is off. Start the demo to begin hand tracking.");
  }, [disposeCameraResources]);

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

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const newW = Math.round((rect.width || video.videoWidth || 640) * dpr);
    const newH = Math.round((rect.height || video.videoHeight || 480) * dpr);
    if (canvas.width !== newW || canvas.height !== newH) {
      canvas.width = newW;
      canvas.height = newH;
    }

    const now = performance.now();
    const results = landmarker.detectForVideo(video, now);
    const detectedHands = (results.landmarks ?? []) as Landmark[][];

    if (detectedHands.length === 0) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (screenParticlesRef.current.length > 0) {
          drawScreenParticles(ctx, screenParticlesRef.current, null, canvas);
        }
      }
      setGesture("none");
      setStatus("Show one or both hands clearly in the camera frame.");
      scheduleNext();
      return;
    }

    const hands = detectedHands
      .map((handLandmarks) => ({
        landmarks: handLandmarks,
        gesture: detectGesture(handLandmarks, []),
        point: toCanvasPoint(canvas, handLandmarks[8]),
        depth: getFingerDepth(handLandmarks),
      }))
      .sort((a, b) => a.point.x - b.point.x);

    const ritual = ritualRef.current;
    const pointingHands = hands.filter((hand) => hand.gesture === "point");
    const pinchHands = hands.filter((hand) => hand.gesture === "pinch");
    const primaryGesture = hands[0]?.gesture ?? "none";
    let nextStatus = "Point one index finger to start charging the red orb.";
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

    setGesture(primaryGesture);

    if (ritual.phase === "red_charging" && ritual.redStartedAt) {
      nextProgress = Math.min((now - ritual.redStartedAt) / CHARGE_DURATION, 1);
      nextStatus = `Red orb charging: ${Math.min(Math.floor((now - ritual.redStartedAt) / 1000), 7)} / 7 seconds.`;
    } else if (ritual.phase === "red_ready") {
      nextProgress = 1;
      nextStatus = "Red orb locked. Point your other index finger to start charging the blue orb.";
    } else if (ritual.phase === "blue_charging" && ritual.blueStartedAt) {
      nextProgress = Math.min((now - ritual.blueStartedAt) / CHARGE_DURATION, 1);
      nextStatus = `Blue orb charging: ${Math.min(Math.floor((now - ritual.blueStartedAt) / 1000), 7)} / 7 seconds.`;
    } else if (ritual.phase === "blue_ready") {
      nextProgress = 1;
      nextStatus = "Blue orb locked. Bring both index fingers closer to combine the orbs.";
    } else if (ritual.phase === "merging") {
      nextProgress = ritual.combinedAt ? Math.min((now - ritual.combinedAt) / MERGE_DURATION, 1) : 0;
      nextStatus = "Red and blue are merging into purple energy. Hold steady for a moment.";
    } else if (ritual.phase === "combined") {
      nextProgress = 1;
      nextStatus = "Purple orb is anchored to one index finger. Pinch that same hand to detonate it.";
    } else if (ritual.phase === "exploded") {
      nextProgress = 1;
      nextStatus = "Purple particles released. Open your hand to clear them, or point to pull color into the next orb.";
    }

    setStatus(nextStatus);
    setRitualPhase(ritual.phase);
    setRitualProgress(nextProgress);

    if (primaryGesture !== "none" && (primaryGesture !== lastGestureRef.current || now - lastTriggerRef.current > 1200)) {
      lastGestureRef.current = primaryGesture;
      lastTriggerRef.current = now;

      const mappedAction = primaryGesture === "swipe_left" || primaryGesture === "swipe_right" ? "open_palm" : primaryGesture;
      setActiveAction(mappedAction);
      setEventCount((count) => count + 1);
    }

    scheduleNext();
  }, []);

  const startCamera = async () => {
    if (isRunningRef.current || isStartingRef.current) {
      return;
    }
    isStartingRef.current = true;
    try {
      setIsLoading(true);
      setStatus("Loading hand tracking model...");

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

      setStatus("Waiting for camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 960 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      isRunningRef.current = true;
      setIsRunning(true);
      setStatus("Camera is on. Point one index finger to start charging the red orb.");
      animationFrameRef.current = requestAnimationFrame(runDetection);
    } catch (error) {
      console.error(error);
      setStatus("Camera could not start. Check browser permissions and try again.");
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

  const phaseChipTop =
    isRunning && ritualPhase !== "idle" && showPowerBar
      ? "top-[4.25rem] sm:top-[4.5rem]"
      : "top-12 sm:top-14";

  /* clamp + non-negative calc: short viewports used to make min(28vh, 100svh-200px)
     negative/tiny; inner layer is h-full with only abs children → 0px tall → blank UI */
  const experienceFrameStyle = {
    height: "min(650px, max(320px, 65svh))",
    minHeight: 320,
    maxHeight: 650,
    width: "100%",
  } as const;

  return (
    <div
      className="gesture-camera-root relative w-full pb-2 text-white"
      style={{ color: "#ffffff" }}
    >
      <div className="flex flex-col gap-[20px] px-4">
        <section className="relative z-10 pt-16 md:pt-20">
          <div className="container-main">
            <h1 className="text-center text-lg font-bold !leading-none tracking-[-0.035em] !text-white sm:text-xl md:text-left md:text-2xl lg:text-3xl xl:text-[2.15rem] md:whitespace-nowrap">
              Turning Anime Into UX
            </h1>
          </div>
        </section>

        <section className="relative z-20 overflow-visible pb-4" aria-label="Camera experience">
        <div className="container-main overflow-visible">
          <div className="relative w-full overflow-visible pr-10 sm:pr-16">
            <div
              className="relative isolate min-h-[320px] w-full overflow-hidden rounded-2xl border-2 border-fuchsia-500/40 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.75)]"
              style={{
                ...experienceFrameStyle,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.1) inset, 0 0 48px rgba(${phaseGlow}, 0.22), 0 24px 80px rgba(0,0,0,0.75)`,
              }}
            >
            <div className="pointer-events-none absolute left-2 top-2 z-[5] h-6 w-6 border-l border-t border-white/25" />
            <div className="pointer-events-none absolute right-2 top-2 z-[5] h-6 w-6 border-r border-t border-white/25" />
            <div className="pointer-events-none absolute bottom-2 left-2 z-[5] h-6 w-6 border-b border-l border-white/18" />
            <div className="pointer-events-none absolute bottom-2 right-2 z-[5] h-6 w-6 border-b border-r border-white/18" />

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
                className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

              {/* Game-style power bar — boot + red/blue charge */}
              {showPowerBar && (
                <div
                  className={`pointer-events-none absolute left-3 top-3 z-30 ${isRunning ? "right-16 sm:right-20" : "right-3"}`}
                >
                  <div className="mb-1.5 flex items-end justify-between gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/45">
                      {powerBarLabel}
                    </span>
                    {!isLoading && (
                      <span className="font-mono text-[10px] tabular-nums text-white/50">
                        {Math.round(ritualProgress * 100)}%
                      </span>
                    )}
                  </div>
                  <div
                    className="relative h-3 overflow-hidden rounded-sm border border-white/10 bg-black/70"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(255,255,255,0.04) 7px, rgba(255,255,255,0.04) 8px)",
                    }}
                  >
                    {isLoading ? (
                      <div className="absolute inset-y-0 left-0 w-[38%] rounded-sm bg-gradient-to-r from-fuchsia-900 via-fuchsia-400 to-fuchsia-900 opacity-90 animate-ritual-boot-sweep" />
                    ) : (
                      <div
                        className={`h-full rounded-sm transition-[width] duration-150 ease-linear ${
                          ritualPhase === "red_charging"
                            ? "bg-gradient-to-r from-rose-900 via-rose-500 to-orange-400 shadow-[0_0_14px_rgba(239,68,68,0.65)]"
                            : "bg-gradient-to-r from-sky-900 via-sky-400 to-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.65)]"
                        }`}
                        style={{ width: `${ritualProgress * 100}%` }}
                      />
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
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/78 !text-white text-white backdrop-blur-sm">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-fuchsia-500/25 bg-fuchsia-950/35">
                    <Camera className="h-8 w-8 text-fuchsia-400/55" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold !text-white tracking-[-0.02em]">Hollow Purple Move</h3>
                  <p className="mb-6 max-w-[300px] px-4 text-center text-[12px] leading-relaxed !text-white/70">
                    Camera runs entirely in your browser. Hand tracking never leaves your device.
                  </p>
                  <button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg transition-colors hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera className="h-4 w-4" />
                    {isLoading ? "Starting…" : "Start camera"}
                  </button>
                </div>
              )}

              {/* Combined ritual strip — always visible; sits above idle overlay */}
              <div className="pointer-events-none absolute bottom-2 left-1/2 z-[60] w-[calc(100%-0.75rem)] max-w-[920px] -translate-x-1/2 px-0.5 sm:bottom-3">
                <div className="mx-auto flex items-stretch justify-center gap-0.5 overflow-x-auto rounded-2xl border border-white/18 bg-black/85 px-1.5 py-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:gap-1 sm:rounded-full sm:px-3 sm:py-2">
                  {RITUAL_STEPS_STATIC.map((step, i) => {
                    const isStepActive = isRunning && i === activePillIndex;
                    const isIdleHint = !isRunning && i === 0;
                    return (
                      <div
                        key={step.label}
                        className={`flex min-w-0 shrink-0 items-center gap-1.5 rounded-full px-1 py-0.5 transition-all duration-300 sm:gap-2 sm:px-2 sm:py-1 ${
                          isStepActive
                            ? "bg-fuchsia-500/20 ring-1 ring-fuchsia-400/50"
                            : isIdleHint
                              ? "bg-white/10 ring-1 ring-white/30"
                              : isRunning
                                ? "opacity-45"
                                : "opacity-65"
                        }`}
                      >
                        <div
                          className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 sm:h-9 sm:w-9 ${
                            isStepActive
                              ? "border-fuchsia-400 shadow-[0_0_14px_rgba(217,70,239,0.45)]"
                              : isIdleHint
                                ? "border-white/35"
                                : "border-white/15"
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
                              <Camera className="h-4 w-4 text-white/75" />
                            </div>
                          )}
                        </div>
                        <span className="max-w-[56px] truncate text-[8px] font-medium leading-tight text-white/90 sm:max-w-[76px] sm:text-[10px]">
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
            <div className="pointer-events-none absolute -right-2 -top-3 z-[70] w-[min(40vw,200px)] max-w-[200px] rotate-[7deg] overflow-hidden rounded-xl border border-white/25 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-md sm:-right-4 sm:-top-2 sm:max-w-[220px] sm:rotate-[6deg]">
              <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 to-transparent" />
              <span className="absolute left-2 top-2 z-[2] text-[7px] font-bold uppercase tracking-[0.2em] text-white/45">
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
