"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { BlurTextEffect } from "@/components/ui/blur-text-effect";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  heroSrc?: string;
  /** Seconds before the crowd starts parting (default 7) */
  revealAfter?: number;
}

const CrowdCanvas = ({
  src,
  rows = 15,
  cols = 7,
  heroSrc = "/Images/me.png",
  revealAfter = 7,
}: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = { src, rows, cols };

    // Reveal state: after `revealAfter`s the crowd slows and the FRONT ROW
    // peeps (closest to camera) disappear one-by-one, revealing the hero who
    // was standing behind them all along. The rows behind keep walking as
    // normal — only the front row thins out.
    const state = {
      centerX: 0,
    };
    let startTime = 0;

    // Hero image + its draw box (computed on resize).
    const hero = document.createElement("img");
    let heroReady = false;
    hero.onload = () => {
      heroReady = true;
    };
    hero.src = heroSrc;
    const heroBox = { x: 0, y: 0, width: 0, height: 0 };

    const REVEAL_STEPS = 6; // 100% -> 40% over 6 one-second steps

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      // Feet at the canvas bottom (as before), just shifted down 80px so the
      // whole crowd sits a bit lower on the page.
      const startY = stage.height - peep.height + 220 + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = { width: 0, height: 0 };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep, stage }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    // Hero: sized to roughly a peep's height, centred, feet on the same
    // baseline as the crowd.
    const layoutHero = () => {
      if (!allPeeps.length) return;
      const peepHeight = allPeeps[0].height;
      // Hero is 35% larger than before (was peepHeight+80, now scaled 1.35x).
      // Positioned so ~22% of him clips below the section (shoes + ~30% of
      // legs off-screen), keeping the same clipping ratio at the new size.
      const targetHeight = peepHeight + 108; // 80 * 1.35 ≈ 108
      const ratio = hero.naturalHeight
        ? hero.naturalWidth / hero.naturalHeight
        : 0.5;
      heroBox.height = targetHeight;
      heroBox.width = targetHeight * ratio;
      heroBox.x = stage.width / 2 - heroBox.width / 2;
      // 120 was the previous shoes+30%-legs clip; +80 shifts hero down with
      // the rest of the crowd.
      heroBox.y = stage.height - heroBox.height + 120 + 220;
      state.centerX = stage.width / 2;
    };

    const render = () => {
      if (!canvas) return;
      const elapsed = startTime > 0 ? (performance.now() - startTime) / 1000 : 0;

      if (elapsed >= revealAfter) {
        const step = Math.min(REVEAL_STEPS, Math.floor(elapsed - revealAfter));
        const walkScale = 1 - 0.1 * step;
        crowd.forEach((p) => {
          if (p.walk) p.walk.timeScale(walkScale);
        });
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      const heroInsertIndex = Math.floor(crowd.length * 0.8);
      const totalFront = crowd.length - heroInsertIndex;

      let maxFront: number;
      if (elapsed < revealAfter) {
        maxFront = totalFront;
      } else if (elapsed < 4) {
        const p = (elapsed - revealAfter) / (4 - revealAfter);
        maxFront = Math.max(1, Math.round(totalFront * (1 - p)));
      } else {
        maxFront = 1;
      }

      let heroDrawn = false;
      let frontCount = 0;
      crowd.forEach((peep, i) => {
        if (i === heroInsertIndex && heroReady && heroBox.width > 0) {
          ctx.drawImage(hero, heroBox.x, heroBox.y, heroBox.width, heroBox.height);
          heroDrawn = true;
        }
        if (i >= heroInsertIndex) {
          frontCount++;
          if (frontCount > maxFront) return;
        }
        peep.render(ctx);
      });
      if (!heroDrawn && heroReady && heroBox.width > 0) {
        ctx.drawImage(hero, heroBox.x, heroBox.y, heroBox.width, heroBox.height);
      }

      const SPOTLIGHT_START = 4;
      const SPOTLIGHT_FADE = 2;
      const spotlightProgress =
        elapsed < SPOTLIGHT_START
          ? 0
          : Math.min(1, (elapsed - SPOTLIGHT_START) / SPOTLIGHT_FADE);
      if (spotlightProgress > 0 && heroBox.width > 0) {
        const heroCX = heroBox.x + heroBox.width / 2;
        const beamTopW = heroBox.width * 0.4;
        const beamBottomW = heroBox.width * 1.3;
        const beamTop = 0;
        const beamBottom = heroBox.y + heroBox.height * 0.9;
        const alpha = 0.3 * spotlightProgress;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(heroCX - beamTopW / 2, beamTop);
        ctx.lineTo(heroCX + beamTopW / 2, beamTop);
        ctx.lineTo(heroCX + beamBottomW / 2, beamBottom);
        ctx.lineTo(heroCX - beamBottomW / 2, beamBottom);
        ctx.closePath();

        const grad = ctx.createLinearGradient(heroCX, beamTop, heroCX, beamBottom);
        grad.addColorStop(0, `rgba(255, 250, 205, ${alpha})`);
        grad.addColorStop(0.6, `rgba(255, 245, 190, ${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(255, 245, 190, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => peep.walk.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      layoutHero();
      initCrowd();
    };

    // Only re-lay-out when the canvas actually changes size (the canvas is
    // often measured before its 90vh height is applied, so we must catch the
    // size settling and reposition the crowd for the real dimensions).
    let lastW = -1;
    let lastH = -1;
    const maybeResize = () => {
      if (!allPeeps.length) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return; // wait until laid out
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      resize();
    };

    const init = () => {
      createPeeps();
      lastW = -1;
      lastH = -1;
      // Defer until the browser has real dimensions (CSS h-[90vh] can apply
      // after the initial script tick). The ResizeObserver will also catch
      // any subsequent size change.
      requestAnimationFrame(() => {
        maybeResize();
        startTime = performance.now();
        gsap.ticker.add(render);
      });
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => maybeResize();
    window.addEventListener("resize", handleResize);
    const resizeObserver = new ResizeObserver(() => maybeResize());
    resizeObserver.observe(canvas);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols, heroSrc, revealAfter]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute bottom-0 left-0 h-[90vh] w-full"
    />
  );
};

const LINE1 = "Sometimes the right designer is hiding in plain sight.";
const LINE2 = "Hi, I'm Hamza. A Product Designer.";
const LINE3 = "I design products that make sense\nfor users and the business.";
const animDuration = (text: string) => text.length * 15 + 300;
const HOLD = 3000;

type LineState = "1in" | "1out" | "2in" | "2out" | "3in";

const HeroTextOverlay = () => {
  const [state, setState] = useState<LineState>("1in");

  useEffect(() => {
    const schedule: [LineState, number][] = [
      ["1out", animDuration(LINE1) + HOLD],
      ["2in", animDuration(LINE1) + HOLD + animDuration(LINE1)],
      ["2out", animDuration(LINE1) + HOLD + animDuration(LINE1) + animDuration(LINE2) + HOLD],
      ["3in", animDuration(LINE1) + HOLD + animDuration(LINE1) + animDuration(LINE2) + HOLD + animDuration(LINE2)],
    ];
    const timers = schedule.map(([s, ms]) => setTimeout(() => setState(s), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  const show1 = state === "1in" || state === "1out";
  const show2 = state === "2in" || state === "2out";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(18%+32px)] z-30 flex flex-col items-center text-center">
      {show1 && (
        <div className="flex w-full justify-center px-4">
          <BlurTextEffect
            className="text-xl font-medium text-black/60 sm:text-3xl md:text-4xl"
            direction={state === "1out" ? "out" : "in"}
          >
            {LINE1}
          </BlurTextEffect>
        </div>
      )}
      {show2 && (
        <div className="flex w-full justify-center px-4">
          <BlurTextEffect
            className="text-2xl font-semibold text-black sm:text-4xl md:text-5xl"
            direction={state === "2out" ? "out" : "in"}
          >
            {LINE2}
          </BlurTextEffect>
        </div>
      )}
      {state === "3in" && (
        <div className="flex w-full justify-center px-4">
          <BlurTextEffect className="text-xl font-medium text-black/70 sm:text-3xl md:text-4xl">
            {LINE3}
          </BlurTextEffect>
        </div>
      )}
    </div>
  );
};

export const CrowdCanvasHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-white text-black">
      <HeroTextOverlay />
      <div className="absolute bottom-0 z-0 h-full w-screen">
        <CrowdCanvas
          src="/Images/peeps/all-peeps.png"
          rows={15}
          cols={7}
          heroSrc="/Images/me.png"
          revealAfter={2}
        />
      </div>
    </section>
  );
};

export { CrowdCanvas };
