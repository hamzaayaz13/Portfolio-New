'use client';

import React, { useEffect, useRef } from 'react';

type BeamsCanvasProps = {
  beamCount?: number;
  speed?: number; // pixels per second
  tiltDeg?: number; // angle of beams
  opacity?: number; // 0..1
  colorStops?: string[]; // tailwind-like hexes
};

// Lightweight, GPU-friendly animated beams using 2D canvas.
// Avoids WebGL/Three dependencies and works reliably with Next.js app router.
export default function BeamsCanvas({
  beamCount = 12,
  speed = 60,
  tiltDeg = 12,
  opacity = 0.12,
  colorStops = ['#ffffff', '#a3a3a3'],
}: BeamsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let lastTs = performance.now();
    let offset = 0; // scroll offset for animation

    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * DPR));
      canvas.height = Math.max(1, Math.floor(height * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const onResize = () => {
      resize();
    };
    resize();
    window.addEventListener('resize', onResize);

    const rad = (tiltDeg * Math.PI) / 180;
    const slope = Math.tan(rad);

    const draw = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000); // clamp for tab switches
      lastTs = ts;
      offset += speed * dt;

      // clear with transparent to allow underlying gradients
      ctx.clearRect(0, 0, width, height);

      // Compute beam geometry
      const spacing = Math.max(40, Math.min(width, height) / 6);
      const thickness = Math.max(12, spacing * 0.35);
      const diag = Math.hypot(width, height);

      // We draw vertical stripes and skew them by the tilt angle using transform
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(0, 0);
      ctx.transform(1, 0, slope, 1, 0, 0); // shear to achieve tilt

      // Gradient across thickness for soft edges
      const makeGradient = () => {
        const g = ctx.createLinearGradient(0, 0, thickness, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(0.15, colorStops[1] ?? '#a3a3a3');
        g.addColorStop(0.5, colorStops[0] ?? '#ffffff');
        g.addColorStop(0.85, colorStops[1] ?? '#a3a3a3');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        return g;
      };

      ctx.fillStyle = makeGradient();

      // Draw enough beams to cover viewport plus overflow
      const total = beamCount + 4;
      for (let i = -2; i < total - 2; i++) {
        const x = ((i * spacing + (offset % spacing)) - thickness) % (spacing * total);
        // Extend height sufficiently to cover skewed transform
        ctx.fillRect(x, -diag, thickness, height + diag * 2);
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [beamCount, speed, tiltDeg, opacity, colorStops]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
    />
  );
}






