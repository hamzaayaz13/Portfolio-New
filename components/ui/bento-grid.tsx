'use client';

import React, { useRef } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';

type BentoItem = {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  videoSrc?: string;
  isLocked?: boolean;
  buttonLink?: string;
};

export function BentoGrid({ 
  items, 
  fullBleed = false,
  onLockedClick
}: { 
  items: BentoItem[]; 
  fullBleed?: boolean;
  onLockedClick?: () => void;
}) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 ${
        fullBleed ? 'w-full max-w-none px-4' : 'w-full max-w-7xl mx-auto px-6'
      }`}
      style={{
        gridAutoRows: '260px',
      }}
    >
      {items.map((item, idx) => (
        <BentoCard key={item.id} item={item} index={idx} onLockedClick={onLockedClick} />
      ))}
    </div>
  );
}

function BentoCard({ 
  item, 
  index,
  onLockedClick 
}: { 
  item: BentoItem; 
  index: number;
  onLockedClick?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onEnter = () => {
    if (item.isLocked) return;
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };
  const onLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (item.isLocked) {
      e.preventDefault();
      onLockedClick?.();
    }
  };

  // Layout pattern on desktop (3 columns):
  // - Item 0: Large (2 cols x 1 row) - top row, spans left side
  // - Item 1: Small (1 col x 1 row) - bottom row, left position
  // - Item 2: Small (1 col x 1 row) - bottom row, middle position  
  // - Item 3: Tall (1 col x 2 rows) - right side, spans full height
  const getSpanClasses = () => {
    if (index === 0) {
      return 'col-span-1 md:col-span-2 lg:col-span-4 row-span-1 md:row-span-2'; // Main wide feature
    } else if (index === 1) {
      return 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2'; // Secondary square
    } else if (index === 2) {
      return 'col-span-1 md:col-span-2 lg:col-span-3 row-span-1'; // Lower wide
    } else {
      return 'col-span-1 md:col-span-2 lg:col-span-3 row-span-1'; // Lower wide
    }
  };

  const spanClasses = getSpanClasses();

  const cardContent = (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={handleClick}
      className={`group relative h-full w-full overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/[0.03] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        item.isLocked 
          ? 'opacity-50 grayscale-[0.9] cursor-pointer' 
          : 'hover:border-white/10 cursor-pointer shadow-none hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Media Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        {!item.isLocked && item.videoSrc ? (
          <video
            ref={videoRef}
            src={item.videoSrc}
            muted
            playsInline
            loop
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-1000 scale-[1.15]"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          item.imageSrc && (
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              className="object-cover opacity-30"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )
        )}
        
        {/* Consistent Overlay for Text Contrast */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* Locked Icon */}
      {item.isLocked && (
        <div className="absolute top-4 right-4 z-20 opacity-30">
          <Lock className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Content Layer - Minimalist */}
      <div className="relative z-20 h-full p-6 md:p-10 flex flex-col justify-end">
        <div className="max-w-[440px]">
          <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-2 group-hover:text-white transition-colors leading-tight">
            {item.title}
          </h3>
          <p className="text-neutral-400 text-xs md:text-sm font-medium leading-relaxed group-hover:text-neutral-300 transition-colors line-clamp-2">
            {item.description}
          </p>
          
          {/* Action Hint - Extremely Subtle */}
          {!item.isLocked && (
            <div className="mt-4 md:mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold">Read Case Study</span>
              <div className="h-px w-6 bg-white/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (item.isLocked || !item.buttonLink) {
    return (
      <div className={spanClasses}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={item.buttonLink} className={spanClasses}>
      {cardContent}
    </Link>
  );
}

export default BentoGrid;


