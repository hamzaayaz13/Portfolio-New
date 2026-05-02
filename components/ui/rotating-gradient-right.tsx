"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ViewportVideo } from "@/components/ui/viewport-video";

type Section = {
  title: string;
  description: string;
  imageSrc: string;
  videoSrc?: string;
  buttonText: string;
  buttonLink?: string;
  isLocked?: boolean;
};

type RotatingGradientRightProps = {
  sections: Section[];
  sensitivityMultiplier?: number;
  wrapperHeightVh?: number;
  onLockedClick?: () => void;
};

export default function RotatingGradientRight({
  sections,
  sensitivityMultiplier = 1.4,
  wrapperHeightVh = 220,
  onLockedClick,
}: RotatingGradientRightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isInView, setIsInView] = useState(false);
  
  // IntersectionObserver to detect when component enters viewport
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (!currentWrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px",
      }
    );

    observer.observe(currentWrapper);

    return () => {
      observer.unobserve(currentWrapper);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only update if component is in view
    if (!isInView) return;
    
    // Map scroll progress with configurable sensitivity
    const adjustedProgress = Math.min(latest * sensitivityMultiplier, 1);
    const progressPerSection = 1 / sections.length;
    const sectionIndex = Math.min(
      Math.floor(adjustedProgress / progressPerSection),
      sections.length - 1
    );
    setActiveSection(sectionIndex);
  });

  // Different gradients for each section - using hex colors for inline styles
  // Generate gradients dynamically based on sections length
  const defaultGradients = [
    "conic-gradient(from 0deg, #34d399, #22d3ee, #3b82f6, #9333ea, #ef4444, #34d399)",
    "conic-gradient(from 0deg, #ec4899, #f43f5e, #f97316, #fbbf24, #eab308, #ec4899)",
    "conic-gradient(from 0deg, #a855f7, #6366f1, #3b82f6, #06b6d4, #14b8a6, #a855f7)",
    "conic-gradient(from 0deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #ef4444)",
  ];
  
  // Ensure we have enough gradients for all sections
  const gradients = Array.from({ length: sections.length }, (_, i) => 
    defaultGradients[i % defaultGradients.length]
  );

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${wrapperHeightVh}vh` }}>
      <section 
        ref={containerRef}
        className="sticky top-0 w-full bg-black text-white px-6 py-12 md:px-16 md:py-16 z-40 overflow-hidden"
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
      >
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:gap-12 md:grid-cols-2 w-full">
        {/* LEFT: Rotating conic gradient glow with changing image - FULL EDGE TO EDGE */}
        <div className="relative mx-auto flex w-full max-w-[60rem] items-center justify-center overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-white/10 shadow-2xl h-[300px] sm:h-[400px] md:h-[500px]">
          {/* Rotating conic gradient glow background */}
          <div className="absolute -inset-20 flex items-center justify-center z-0 opacity-40">
            <motion.div
              className="
                h-[140%] w-[140%] blur-3xl
                animate-[spin_12s_linear_infinite]
              "
              style={{
                background: gradients[activeSection],
              }}
            />
          </div>

          {/* Content Container - FULL EDGE TO EDGE MEDIA */}
          <div 
            className="relative w-full h-full z-10 overflow-hidden"
            onClick={() => sections[activeSection].isLocked && onLockedClick?.()}
          >
            {/* Media Layers with fade transitions */}
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeSection === index ? 1 : 0,
                  scale: activeSection === index ? 1 : 1.05,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                {/* Overlay for depth and text contrast */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {section.videoSrc ? (
                  <ViewportVideo
                    src={activeSection === index ? section.videoSrc : ""}
                    active={activeSection === index && isInView}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover scale-[1.05]"
                  />
                ) : (
                  <Image
                    src={section.imageSrc}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 50vw"
                  />
                )}

                {/* Locked Overlay */}
                {section.isLocked && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 rounded-full bg-white/10 border border-white/20">
                        <Lock className="h-6 w-6 md:h-8 md:w-8 text-white/50" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">In Progress</span>
                    </div>
                  </div>
                )}

                {/* Bottom Info Bar - Minimalist */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-30 flex items-end justify-between">
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Case Study</span>
                      <div className="h-px w-4 md:w-8 bg-white/20" />
                      <span className="text-[9px] md:text-[10px] font-bold text-white/50">{activeSection + 1} / {sections.length}</span>
                    </div>
                    {/* Small Progress Line */}
                    <div className="h-[2px] w-24 md:w-32 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  {!section.isLocked && (
                    <div className="px-4 py-1.5 md:px-6 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all">
                      Preview
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: Text content that fades in/out - aligned to center of card */}
        <div className="relative h-full flex flex-col justify-center">
          <div className="relative w-full min-h-[200px] md:min-h-[300px]">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: activeSection === index ? 1 : 0,
                    y: activeSection === index ? 0 : 30,
                    pointerEvents: activeSection === index ? "auto" : "none",
                  }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.5 },
                  }}
                  className="absolute inset-0"
                >
                  <motion.h2 
                    className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-3 md:mb-4"
                    animate={{
                      opacity: activeSection === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {section.title}
                  </motion.h2>
                  <motion.p 
                    className="text-gray-400 text-sm sm:text-base lg:text-xl leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-none"
                    animate={{
                      opacity: activeSection === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {section.description}
                  </motion.p>
                  <motion.div
                    animate={{
                      opacity: activeSection === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ pointerEvents: activeSection === index ? "auto" : "none" }}
                  >
                    {section.isLocked ? (
                      <button 
                        onClick={() => onLockedClick?.()}
                        className="inline-flex items-center px-0 text-white hover:text-gray-300 transition-colors underline-offset-4 hover:underline text-sm md:text-base font-bold uppercase tracking-widest"
                      >
                        {section.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
                      </button>
                    ) : section.buttonLink ? (
                      <Link 
                        href={section.buttonLink}
                        className="inline-flex items-center px-0 text-white hover:text-gray-300 transition-colors underline-offset-4 hover:underline text-sm md:text-base font-bold uppercase tracking-widest"
                      >
                        {section.buttonText} <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    ) : (
                      <Button variant="link" className="px-0 text-white hover:text-gray-300 text-sm md:text-base font-bold uppercase tracking-widest">
                        {section.buttonText} <ArrowRight className="ml-2" />
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
