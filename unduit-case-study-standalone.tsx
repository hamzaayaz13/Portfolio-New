/**
 * UNDUIT CASE STUDY - STANDALONE FILE
 * 
 * This file contains the complete Unduit case study page with all dependencies.
 * Copy this file to your project and follow the setup instructions below.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Install required dependencies:
 *    npm install framer-motion next react react-dom
 *    npm install @tsparticles/react @tsparticles/slim @tsparticles/engine
 *    npm install lucide-react
 *    npm install tailwindcss
 * 
 * 2. Required utility function (create lib/utils.ts):
 *    export function cn(...inputs: any[]) {
 *      return inputs.filter(Boolean).join(" ");
 *    }
 * 
 * 3. File structure:
 *    - Place this file in: app/case-studies/unduit/page.tsx (Next.js App Router)
 *    - Or adapt for your routing structure
 * 
 * 4. Update imports:
 *    - Change '@/components/ui/...' to your component paths
 *    - Change '@/lib/utils' to your utils path
 *    - Update Link href="/dark-portfolio" to your portfolio route
 * 
 * 5. Assets:
 *    - Add video file: /public/Animated_Spotlight_on_Laptop.mp4
 *    - Or update video src path in the hero section
 */

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, GripVertical } from 'lucide-react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container, SingleOrMultiple } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

// Utility function - make sure this exists in your project
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

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
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
          <div className="flex items-center justify-between py-4">
            <Link 
              href="/dark-portfolio"
              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Hamza Ayaz
            </Link>
            <Link
              href="/dark-portfolio"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with ContainerScroll */}
      <div className="flex flex-col overflow-hidden pb-5 pt-20">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-[40px] font-medium text-white mb-4">
                How I Helped Unduit
                <br />
                <span className="text-4xl md:text-[5rem] font-medium mt-2 leading-none text-white">
                  Cut Support Tickets with
                </span>
                <br />
                <span className="text-4xl md:text-[5rem] font-bold leading-none bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Better UX
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mt-6 max-w-3xl mx-auto">
                Redesigning Unduit&apos;s Refresh app to make device recovery and buy-back flows intuitive, guided, and error-free.
              </p>
            </>
          }
        >
          <video
            src="/Animated_Spotlight_on_Laptop.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* TL;DR Section */}
      <section className="py-20" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">TL;DR</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                <strong className="text-white">Project:</strong> Redesign of Unduit&apos;s Refresh app (device recovery & buy-back flow)
              </p>
              <p>
                <strong className="text-white">Problem:</strong> IT/HR managers confused by unclear copy, irrelevant UI elements, and complex campaign setup — causing mistakes and support tickets.
              </p>
              <p>
                <strong className="text-white">Approach:</strong> Conducted user interviews + session analysis → identified friction points → simplified flow, rewrote copy, removed distractions.
              </p>
              <p>
                <strong className="text-white">Solution:</strong> A guided, step-by-step campaign setup with clearer language, inline help, and progress indicators.
              </p>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <p className="text-lg font-semibold text-white mb-4">Impact:</p>
                <ul className="list-disc list-inside space-y-3 text-gray-300">
                  <li>30% faster completion time</li>
                  <li>Significant drop in support tickets</li>
                  <li>Users described the experience as &quot;straightforward&quot; and &quot;finally makes sense&quot;</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenge Section - Two Column */}
      <section className="py-20 bg-gray-950/30" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">The Challenge</h2>
              <div className="space-y-5 text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-white">Users:</strong> Mid-to-senior level IT or HR managers in Fortune 500 companies.
                </p>
                <div>
                  <p className="mb-3">
                    <strong className="text-white">Problem:</strong>
                  </p>
                  <p className="mb-3">The existing design created friction:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Poorly written copy failed to guide users.</li>
                    <li>An irrelevant &quot;comparison panel&quot; distracted from the flow.</li>
                    <li>Managers struggled to set up campaigns correctly, causing delays and support tickets.</li>
                  </ul>
                </div>
                <div className="pt-4">
                  <p className="mb-3">
                    <strong className="text-white">Impact:</strong>
                  </p>
                  <p>Users lost confidence in the product, and technical teams were burdened with avoidable support requests.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
                <Image
                  src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop"
                  alt="Old Refresh App UI"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research & Insights Section */}
      <section className="py-20" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">Research & Insights</h2>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              To better understand the problem, I used a mix of qualitative and quantitative methods:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 mb-10 ml-4">
              <li><strong className="text-white">User Interviews:</strong> 5 sessions with IT & HR managers to capture frustrations.</li>
              <li><strong className="text-white">Behavioral Analytics (PostHog):</strong> Session recordings revealed friction points and drop-offs.</li>
            </ul>
            <h3 className="text-2xl font-semibold mb-6 text-white">Key Findings</h3>
            <ul className="list-disc list-inside space-y-3 text-gray-300 mb-10 ml-4">
              <li><strong className="text-white">Copy didn&apos;t guide users:</strong> Labels and instructions were vague, creating uncertainty.</li>
              <li><strong className="text-white">Irrelevant UI elements:</strong> Right-hand &quot;comparison panel&quot; wasn&apos;t actionable.</li>
              <li><strong className="text-white">Critical flow confusion:</strong> Complex setup form caused cascading errors.</li>
            </ul>
            <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                alt="Analytics Dashboard"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Goals Section */}
      <section className="py-20 bg-gray-950/30" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">Design Goals</h2>
            <ol className="space-y-5 text-gray-300 leading-relaxed mb-10">
              <li className="flex gap-4">
                <span className="text-white font-bold text-xl">1.</span>
                <span className="text-lg">Simplify the campaign setup flow so managers could complete tasks without confusion.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-white font-bold text-xl">2.</span>
                <span className="text-lg">Use copy as guidance — every word should help users take the right step.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-white font-bold text-xl">3.</span>
                <span className="text-lg">Remove distractions and keep focus on completing the primary task.</span>
              </li>
            </ol>
            <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                alt="Design Goals"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process & Solutions Section */}
      <section className="py-20" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">Process & Solutions</h2>

            {/* Solution 1 */}
            <div className="mb-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-5 text-white">1. Information Architecture</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Mapped the existing flow and removed unnecessary steps. Revised architecture emphasized a <strong className="text-white">linear, self-guided flow</strong> — users could only move forward once key steps were completed.
                  </p>
                </div>
                <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                    alt="Flow Diagram"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Solution 2 */}
            <div className="mb-20">
              <h3 className="text-2xl font-semibold mb-5 text-white">2. Copywriting for UX</h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Rewrote instructions and field labels to make them action-oriented and context-aware.
              </p>
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse border border-gray-800">
                  <thead>
                    <tr className="bg-gray-900">
                      <th className="border border-gray-800 px-6 py-4 text-left text-white font-semibold">Old</th>
                      <th className="border border-gray-800 px-6 py-4 text-left text-white font-semibold">New</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-800 px-6 py-4 text-gray-300">&quot;Custom Form Design&quot;</td>
                      <td className="border border-gray-800 px-6 py-4 text-gray-300">&quot;What can employees do?&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
                <Image
                  src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop"
                  alt="Copy Examples"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Solution 3 */}
            <div className="mb-20">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-5 text-white">3. UI Simplification</h3>
                  <ul className="list-disc list-inside space-y-3 text-gray-300 ml-4 text-lg">
                    <li>Removed the right-side comparison panel</li>
                    <li>Introduced inline help + micro-tooltips</li>
                    <li>Grouped related fields into sections</li>
                  </ul>
                </div>
                <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
                  <Image
                    src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1200&auto=format&fit=crop"
                    alt="Simplified UI"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Solution 4 */}
            <div>
              <h3 className="text-2xl font-semibold mb-5 text-white">4. Iterative Prototyping</h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Built quick wireframes → tested with users → refined into high-fidelity UI. Added a progress indicator to reassure managers where they were in the process.
              </p>
              <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
                <Image
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop"
                  alt="Prototype"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="py-20 bg-gray-950/30" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">Outcome</h2>
            <ul className="space-y-5 text-gray-300 mb-16 leading-relaxed text-lg">
              <li><strong className="text-white">Improved self-guidance:</strong> Managers completed campaign setup with minimal support.</li>
              <li><strong className="text-white">Clearer communication:</strong> Updated copy reduced mistakes.</li>
              <li><strong className="text-white">Cleaner UI:</strong> Focused attention on the task at hand.</li>
            </ul>

            {/* Before/After Comparison */}
            <div className="flex justify-center">
              <Compare
                firstImage="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=1200&auto=format&fit=crop"
                secondImage="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=1200&auto=format&fit=crop"
                firstImageClassName="object-cover object-left-top"
                secondImageClassname="object-cover object-left-top"
                className="h-[400px] w-full md:h-[500px] md:w-[800px]"
                slideMode="hover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">Impact</h2>
            <ul className="space-y-5 text-gray-300 mb-10 leading-relaxed text-lg">
              <li><strong className="text-white">Drop in support requests:</strong> Setup-related tickets decreased within the first month.</li>
              <li><strong className="text-white">Faster completion:</strong> Managers finished setup <strong className="text-white">30% faster</strong> than before.</li>
              <li><strong className="text-white">Positive feedback:</strong> &quot;Straightforward,&quot; &quot;finally makes sense.&quot;</li>
            </ul>
            <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                alt="Impact Chart"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reflection Section */}
      <section className="py-20 bg-gray-950/30" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">Reflection</h2>
            <div className="space-y-5 text-gray-300 leading-relaxed text-lg mb-10">
              <p>
                This project reinforced that <strong className="text-white">copy is design</strong> — words are as critical as visuals in guiding users through complex flows.
              </p>
              <p>
                It also showed the value of <strong className="text-white">observing real user behavior</strong> instead of assuming.
              </p>
              <p>
                If given more time, I would conduct <strong className="text-white">A/B testing</strong> on onboarding flows to validate which structure reduces time-to-completion the most.
              </p>
            </div>
            <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
                alt="Reflection"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-gray-800 bg-black" style={{ paddingLeft: '120px', paddingRight: '120px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2024 Hamza Ayaz. All rights reserved.</p>
            </div>
            <Link
              href="/dark-portfolio"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Back to Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

