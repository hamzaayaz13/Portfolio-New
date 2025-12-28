'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, GripVertical } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import { cn } from '@/lib/utils';
import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { Timeline } from '@/components/ui/timeline';
import { CaseStudyBottomNav } from '@/components/ui/case-study-bottom-nav';

// ============================================================================
// SPARKLES CORE COMPONENT
// ============================================================================

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;

  const [init, setInit] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: { duration: 1 },
      });
    }
  };

  const generatedId = React.useId();

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || "#0d47a1" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: false, mode: "repulse" },
                resize: true as any,
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              color: { value: particleColor || "#ffffff" },
              move: {
                enable: true,
                speed: { min: 0.1, max: 1 },
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity || 120,
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: {
                  enable: true,
                  speed: speed || 4,
                  mode: "auto",
                  startValue: "random",
                },
              },
              shape: { type: "circle" },
              size: {
                value: { min: minSize || 1, max: maxSize || 3 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};

// ============================================================================
// COMPARE COMPONENT
// ============================================================================

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;
      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };
    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    setIsMouseOver(true);
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => handleStart(e.clientX),
    [handleStart]
  );

  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleStart(e.touches[0].clientX);
      }
    },
    [handleStart, autoplay]
  );

  const handleTouchEnd = useCallback(() => {
    if (!autoplay) {
      handleEnd();
    }
  }, [handleEnd, autoplay]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, autoplay]
  );

  return (
    <div
      ref={sliderRef}
      className={cn("w-[400px] h-[400px] overflow-hidden", className)}
      style={{
        position: "relative",
        cursor: slideMode === "drag" ? "grab" : "col-resize",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={mouseLeaveHandler}
      onMouseEnter={mouseEnterHandler}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence initial={false}>
        <motion.div
          className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-indigo-500 to-transparent"
          style={{
            left: `${sliderXPercent}%`,
            top: "0",
            zIndex: 40,
          }}
          transition={{ duration: 0 }}
        >
          <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-indigo-400 via-transparent to-transparent z-20 opacity-50" />
          <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100" />
          <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
            <MemoizedSparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>
          {showHandlebar && (
            <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <GripVertical className="h-4 w-4 text-black" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
        <AnimatePresence initial={false}>
          {firstImage ? (
            <motion.div
              className={cn(
                "absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none overflow-hidden",
                firstImageClassName
              )}
              style={{
                clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
              }}
              transition={{ duration: 0 }}
            >
              <img
                alt="first image"
                src={firstImage}
                className={cn(
                  "absolute inset-0 z-20 rounded-2xl shrink-0 w-full h-full select-none",
                  firstImageClassName
                )}
                draggable={false}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {secondImage ? (
          <motion.img
            className={cn(
              "absolute top-0 left-0 z-[19] rounded-2xl w-full h-full select-none",
              secondImageClassname
            )}
            alt="second image"
            src={secondImage}
            draggable={false}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);

// ============================================================================
// CONTAINER SCROLL COMPONENT
// ============================================================================

const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-5 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: any;
  scale: any;
  translate: any;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
        {children}
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN CASE STUDY PAGE
// ============================================================================

export default function UnduitCaseStudy() {
  const timelineData = [
    {
      title: "01. Audit & Strategy",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">
            I began by mapping every single click in the recovery flow. The audit revealed a major bottleneck: users were forced to make decisions on irrelevant options before they even started the core task.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-white font-semibold mb-2">The Friction</h4>
              <p className="text-sm text-gray-400">Non-linear flows and a &quot;comparison panel&quot; that added noise but zero value to the HR managers.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-white font-semibold mb-2">The Strategy</h4>
              <p className="text-sm text-gray-400">Remove all non-essential UI. Pivot to a linear &quot;Progressive Disclosure&quot; model where each step is self-contained.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "02. UX Writing as Design",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">
            In enterprise tools, words are the primary interface. I treated copy as a first-class citizen, replacing technical jargon with human-centric questions.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
              <p className="text-gray-400"><span className="text-white font-medium">From:</span> &quot;Custom Form Design&quot; → <span className="text-white font-medium">To:</span> &quot;What do you want employees to see?&quot;</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500 shrink-0" />
              <p className="text-gray-400"><span className="text-white font-medium">From:</span> &quot;Configure Campaign Parameters&quot; → <span className="text-white font-medium">To:</span> &quot;Tell us about your recovery goals.&quot;</p>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "03. UI Simplification",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">
            The goal was to make the interface disappear. We moved from a cluttered dashboard view to a focused &quot;distraction-free&quot; setup mode.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Inline Guidance", "Progress Indicators", "Grouped Fields", "Actionable Help"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "04. Validation & Refinement",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-lg leading-relaxed">
            We didn&apos;t just design and ship. We built high-fidelity interactive prototypes and ran them through 5 IT managers to ensure every edge case was handled.
          </p>
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
            <p className="text-white italic text-lg">
              &quot;This finally makes sense. I don&apos;t feel like I&apos;m going to break something anymore.&quot;
            </p>
            <p className="text-gray-500 mt-2 text-sm">— Senior IT Manager, Beta Test</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Hero Section */}
      <div className="flex flex-col overflow-hidden pb-10 pt-32">
        <ContainerScroll
          titleComponent={
            <div className="px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-[32px] md:text-[40px] font-medium text-white mb-4">
                  How I Helped Unduit
                  <br />
                  <span className="text-2xl sm:text-4xl md:text-[5rem] font-medium mt-2 leading-none text-white">
                    Cut Support Tickets with
                  </span>
                  <br />
                  <span className="text-2xl sm:text-4xl md:text-[5rem] font-bold leading-none bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Better UX
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-3xl mx-auto">
                  Redesigning Unduit&apos;s Refresh app to make device recovery and buy-back flows intuitive, guided, and error-free.
                </p>
              </motion.div>
            </div>
          }
        >
          <video
            src="/Animated_Spotlight_on_Laptop.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="mx-auto rounded-2xl object-cover h-full w-full"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-40 pb-40">
        
        {/* TL;DR Section - Redesigned for scanability */}
        <section id="overview" className="scroll-mt-32">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">TL;DR</h2>
                <p className="text-gray-400">The quick overview of project impact and strategy.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Device Recovery", "B2B SaaS", "Enterprise UX"].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold">01</span>
                </div>
                <h3 className="text-white font-bold text-xl tracking-tight">Project Overview</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Redesign of Unduit&apos;s Refresh app, focusing on the core device recovery and buy-back flow for enterprise IT managers.
                </p>
              </div>

              {/* Problem Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 font-bold">02</span>
                </div>
                <h3 className="text-white font-bold text-xl tracking-tight">The Friction</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Confusing setup flows and irrelevant UI elements led to avoidable technical mistakes and a high volume of support tickets.
                </p>
              </div>

              {/* Solution Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 space-y-4 lg:col-span-1">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-emerald-400 font-bold">03</span>
                </div>
                <h3 className="text-white font-bold text-xl tracking-tight">The Strategy</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A guided, linear campaign setup powered by strategic UX writing, inline help, and clear progress indicators.
                </p>
              </div>
            </div>

            {/* Impact Metric Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
              <div className="p-6 text-center space-y-1">
                <p className="text-3xl font-bold text-white tracking-tighter">30%</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Faster Setup</p>
              </div>
              <div className="p-6 text-center border-l border-white/5 space-y-1">
                <p className="text-3xl font-bold text-white tracking-tighter">Significant</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Support Drop</p>
              </div>
              <div className="p-6 text-center border-l border-white/5 space-y-1">
                <p className="text-3xl font-bold text-white tracking-tighter">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Self-Guided</p>
              </div>
              <div className="p-6 text-center border-l border-white/5 space-y-1">
                <p className="text-3xl font-bold text-white tracking-tighter">Zero</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">Setup Errors</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge Section - Editorial Layout */}
        <section className="scroll-mt-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-4">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/Images/bbc1b891-bc25-47d9-a8e5-5e8c20f6c397-screen-shot-2018-02-22-at-95910-am (1).avif"
                  alt="Legacy App UX"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-400 text-center">What users felt when trying to set up campaigns in the old Refresh app</p>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The Problem</h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>
                  For an IT manager at a Fortune 500 company, time is the most valuable resource. The original Unduit app was costing them hours of frustration.
                </p>
                <div className="space-y-4">
                  {[
                    "Confusing labels that failed to describe the next action.",
                    "Irrelevant 'comparison panels' that added visual noise.",
                    "Non-linear flows that allowed users to skip critical data points.",
                  ].map((point, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-purple-500 font-bold">/</span>
                      <p className="text-gray-300">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research & Findings - Visual Cards */}
        <section className="scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Research & Insights</h2>
            <p className="text-gray-400 text-lg">
              We combined stakeholder interviews with behavioral analytics to pinpoint exactly where the experience was breaking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Vague Guidance",
                desc: "Instructions were technical rather than task-oriented, leaving users guessing.",
                image: "/Images/new 1.png"
              },
              {
                title: "Visual Noise",
                desc: "The comparison panel was a major distraction that users never actually interacted with.",
                image: "/Images/new 2.png"
              },
              {
                title: "Flow Fragmentation",
                desc: "Users often missed mandatory fields because the layout was too dense.",
                image: "/Images/new 3.png"
              }
            ].map((finding, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all overflow-hidden"
              >
                <div className="relative aspect-video mb-8 rounded-xl overflow-hidden border border-white/10 group-hover:border-purple-500/30 transition-colors">
                  <Image 
                    src={finding.image} 
                    alt={finding.title} 
                    fill 
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{finding.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{finding.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process Section - THE TIMELINE */}
        <section className="scroll-mt-32 -mx-6 md:-mx-12 lg:-mx-20">
          <div className="bg-neutral-950/50 py-32 px-6 md:px-12 lg:px-20">
            <div className="max-w-4xl mb-20">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">The Process</h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                A creative, step-by-step approach to turning complexity into clarity. No images, just pure strategy and execution.
              </p>
            </div>
            <Timeline data={timelineData} />
          </div>
        </section>

        {/* Results & Comparison */}
        <section className="scroll-mt-32">
          <div className="max-w-4xl mx-auto mb-16 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">The Outcome</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The final product was a lean, guided experience. We moved from a tool that required training to one that was self-explanatory. Updated copy reduced mistakes, and the cleaner UI focused attention on the task at hand.
            </p>
            <div className="flex justify-center gap-12 pt-4">
              <div>
                <p className="text-4xl font-bold text-white">30%</p>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-mono mt-1">Faster Completion</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">-45%</p>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-mono mt-1">Error Rate</p>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="relative h-[400px] md:h-[600px] lg:h-[800px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black shadow-2xl">
              <div className="absolute top-8 left-8 z-30 pointer-events-none">
                <span className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/60">Before</span>
              </div>
              <div className="absolute top-8 right-8 z-30 pointer-events-none text-right">
                <span className="px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-md border border-purple-500/30 text-[10px] font-bold uppercase tracking-widest text-purple-300">After Redesign</span>
              </div>
              
              <Compare
                firstImage="/Images/Refresh Buy Step-1.png"
                secondImage="/Images/Dashboard (1).png"
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-full w-full"
                slideMode="hover"
              />
            </div>
            <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </section>

        {/* Impact & Evolution */}
        <section className="scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Impact & System Evolution</h2>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li><strong className="text-white">Drop in support requests:</strong> Setup-related tickets decreased within the first month.</li>
              <li><strong className="text-white">Positive feedback:</strong> Managers described the experience as &quot;straightforward&quot; and &quot;finally makes sense.&quot;</li>
            </ul>
          </div>
          <div className="w-full rounded-2xl overflow-hidden border border-white/5 shadow-inner">
            <ThreeDMarquee
              images={[
                "/Images/Dashboard.png",
                "/Images/Dashboard-1.png",
                "/Images/Dashboard-2.png",
                "/Images/Dashboard-3.png",
                "/Images/Dashboard-4.png",
                "/Images/Dashboard-5.png",
                "/Images/Dashboard (1).png",
                "/Images/1st Page.png",
                "/Images/Dashboard.png",
                "/Images/Dashboard-1.png",
                "/Images/Dashboard-2.png",
                "/Images/Dashboard-3.png",
                "/Images/Dashboard-4.png",
                "/Images/Dashboard-5.png",
                "/Images/Dashboard (1).png",
                "/Images/Dashboard.png",
                "/Images/Dashboard-1.png",
                "/Images/Dashboard-2.png",
                "/Images/Dashboard-3.png",
                "/Images/Dashboard-4.png",
                "/Images/Dashboard-5.png",
                "/Images/Dashboard (1).png",
                "/Images/Dashboard.png",
                "/Images/Dashboard-1.png",
                "/Images/Dashboard-2.png",
                "/Images/Dashboard-3.png",
                "/Images/Dashboard-4.png",
                "/Images/Dashboard-5.png",
                "/Images/Dashboard (1).png",
                "/Images/Dashboard.png",
                "/Images/Dashboard-1.png"
              ]}
              className="bg-gray-900/50"
            />
          </div>
        </section>

        {/* Reflection */}
        <section className="relative py-32 rounded-[3rem] overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.02] border border-white/5 -z-10" />
          <div className="max-w-4xl mx-auto px-8 text-center space-y-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Reflections</h2>
            <p className="text-gray-400 text-xl leading-relaxed">
              This project reinforced that <span className="text-white underline decoration-purple-500/50 underline-offset-4">UX writing is not an afterthought</span>—it is a core design tool. By aligning the system&apos;s language with the user&apos;s mental model, we eliminated more friction than any visual update could.
            </p>
          </div>
        </section>

        {/* Next Case Study CTA */}
        <section className="scroll-mt-32">
          <div className="group relative p-12 md:p-20 rounded-[3rem] overflow-hidden bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-8">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="space-y-4 relative z-10">
              <span className="text-purple-400 font-mono text-sm uppercase tracking-widest">Up Next</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Dubizzle Affiliate App</h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                Streamlining service bookings and payment flows for automotive partners in Dubai.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/case-studies/mobile-nav"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white text-black font-bold hover:bg-purple-500 hover:text-white transition-all duration-300"
              >
                Read Case Study
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white/5 text-gray-400 font-bold hover:bg-white/10 hover:text-white transition-all duration-300 border border-white/5"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Floating Nav */}
      <CaseStudyBottomNav 
        nextCaseStudyLink="/case-studies/mobile-nav"
        nextCaseStudyName="Next Case Study"
      />

      {/* Simplified Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-sm font-mono">&copy; 2024 HAMZA AYAZ · DESIGNED FOR IMPACT</p>
          <div className="flex gap-8">
            <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">LinkedIn</Link>
            <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">Dribbble</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

