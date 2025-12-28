'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

type StickyItem = {
  title: string;
  description: string;
  content?: React.ReactNode;
};

export function StickyScroll({
  content,
  contentClassName,
  className,
}: {
  content: StickyItem[];
  contentClassName?: string;
  className?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [previewY, setPreviewY] = useState(0);

  // Tie progress to the page scroll relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const cardLength = content.length || 1;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) return index;
      return acc;
    }, 0);
    setActiveCard(closestBreakpointIndex);
  });

  // Track preview Y to follow the currently focused text block
  useEffect(() => {
    const updateY = () => {
      const container = containerRef.current;
      const current = itemRefs.current[activeCard];
      if (!container || !current) return;
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const currentTop = current.getBoundingClientRect().top + window.scrollY;
      const y = currentTop - containerTop;
      setPreviewY(y);
    };
    updateY();
    window.addEventListener('scroll', updateY, { passive: true });
    window.addEventListener('resize', updateY);
    return () => {
      window.removeEventListener('scroll', updateY);
      window.removeEventListener('resize', updateY);
    };
  }, [activeCard]);

  // Parallax motion values (subtle)
  const leftParallax = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const previewParallax = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <motion.div
      // Transparent background – let page background show through
      style={{ backgroundColor: 'transparent' }}
      className={cn(
        'relative flex min-h-[160vh] justify-center gap-10 rounded-md p-10',
        className
      )}
      ref={containerRef}
    >
      {/* LEFT: Large title/description that crossfades */}
      <motion.div className="relative flex-1 px-4" style={{ y: leftParallax }}>
        <div className="relative mx-auto max-w-3xl">
          {content.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="my-32"
              ref={(el) => { itemRefs.current[index] = el; }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: activeCard === index ? 1 : 0, y: activeCard === index ? 0 : 16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: activeCard === index ? 1 : 0, y: activeCard === index ? 0 : 12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="mt-8 text-xl md:text-2xl lg:text-3xl leading-relaxed text-slate-300 max-w-2xl"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </motion.div>

      {/* RIGHT: Preview follows the active text position with parallax */}
      <div
        className={cn(
          'absolute right-6 top-0 hidden h-[28rem] w-[28rem] overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 lg:block',
          contentClassName
        )}
        style={{ 
          transform: `translateY(${previewY}px)`
        }}
      >
        <motion.div
          style={{ y: previewParallax }}
        >
          {content[activeCard]?.content ?? null}
        </motion.div>
      </div>
    </motion.div>
  );
}


