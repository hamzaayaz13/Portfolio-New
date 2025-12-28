'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface FloatingCard {
  src: string;
  alt: string;
  x: number; // CSS custom property --x value
  y: number; // CSS custom property --y value
}

// Calculate evenly spaced positions around a circle
// Using polar coordinates: radius of 280px, 5 cards evenly spaced (72° apart)
const calculateCardPositions = (count: number, radius: number) => {
  const positions: { x: number; y: number }[] = [];
  const angleStep = (2 * Math.PI) / count;
  
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2; // Start from top (-90°)
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positions.push({ x: Math.round(x), y: Math.round(y) });
  }
  
  return positions;
};

// Pre-calculate positions for 5 cards with 280px radius - evenly spaced around circle
const getDefaultCards = (): FloatingCard[] => {
  try {
    const positions = calculateCardPositions(5, 280);
    return [
      {
        src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=400&auto=format&fit=crop',
        alt: 'Project 1',
        x: positions[0]?.x ?? 0,
        y: positions[0]?.y ?? -280,
      },
      {
        src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=400&auto=format&fit=crop',
        alt: 'Project 2',
        x: positions[1]?.x ?? 238,
        y: positions[1]?.y ?? -87,
      },
      {
        src: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=400&auto=format&fit=crop',
        alt: 'Project 3',
        x: positions[2]?.x ?? 147,
        y: positions[2]?.y ?? 227,
      },
      {
        src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop',
        alt: 'Project 4',
        x: positions[3]?.x ?? -147,
        y: positions[3]?.y ?? 227,
      },
      {
        src: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=400&auto=format&fit=crop',
        alt: 'Project 5',
        x: positions[4]?.x ?? -238,
        y: positions[4]?.y ?? -87,
      },
    ];
  } catch (error) {
    // Fallback to safe default positions if calculation fails
    return [
      { src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=400&auto=format&fit=crop', alt: 'Project 1', x: 0, y: -280 },
      { src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=400&auto=format&fit=crop', alt: 'Project 2', x: 238, y: -87 },
      { src: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=400&auto=format&fit=crop', alt: 'Project 3', x: 147, y: 227 },
      { src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop', alt: 'Project 4', x: -147, y: 227 },
      { src: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=400&auto=format&fit=crop', alt: 'Project 5', x: -238, y: -87 },
    ];
  }
};

const defaultCards = getDefaultCards();

export default function FloatingParallaxHero({
  headline = "Hello there,\nI'm a designer who cares\nabout making beautiful things\nthat help people.",
  cards = defaultCards,
}: {
  headline?: string;
  cards?: FloatingCard[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const hero = containerRef.current;
    if (!hero) return;

    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate offset from center (in pixels)
      mouseX = e.clientX - centerX;
      mouseY = e.clientY - centerY;
      
      updateTransforms();
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      updateTransforms();
    };

    const updateTransforms = () => {
      floatingCardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        // Parallax intensity varies by index (different speeds for depth)
        const parallaxSpeed = 0.3 + (index * 0.1);
        
        // Mouse parallax offset (max ±30-50px)
        const mouseOffsetX = mouseX * parallaxSpeed * 0.01;
        const mouseOffsetY = mouseY * parallaxSpeed * 0.01;
        
        // Scroll parallax offset
        const scrollOffsetY = scrollY * parallaxSpeed * 0.05;
        
        // Update CSS custom properties for mouse and scroll offsets
        card.style.setProperty('--mouse-x', `${mouseOffsetX}px`);
        card.style.setProperty('--mouse-y', `${mouseOffsetY + scrollOffsetY}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial update
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        perspective: '1000px',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <h1
        style={{
          position: 'relative',
          zIndex: 5,
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          lineHeight: 1.4,
          fontWeight: 600,
          maxWidth: '600px',
          color: 'white',
        }}
      >
        {headline.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < headline.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h1>

      <div
        className="floating-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => { floatingCardsRef.current[index] = el; }}
            className="float"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '180px',
              height: '120px',
              borderRadius: '12px',
              transform: 'translate(calc(var(--x) * 1px + var(--mouse-x, 0px)), calc(var(--y) * 1px + var(--mouse-y, 0px))) translate(-50%, -50%)',
              transition: 'transform 0.2s ease-out',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              '--x': `${card.x}`,
              '--y': `${card.y}`,
              '--mouse-x': '0px',
              '--mouse-y': '0px',
            } as React.CSSProperties}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              className="object-cover rounded-[12px]"
              sizes="180px"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

