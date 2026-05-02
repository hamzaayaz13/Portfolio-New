"use client";

import { type PointerEvent, type RefObject, useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { ViewportVideo } from "@/components/ui/viewport-video";
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/ui/infinite-drag-scroll";

let hasShownHomeIntroThisVisit = false;

const AUDIENCES = [
  {
    id: "anyone",
    label: "For anyone",
    heading: "I design digital products that reduce friction and help people make confident decisions.",
  },
  {
    id: "recruiters",
    label: "Recruiters",
    heading: "I'm a product designer working on large-scale marketplace and consumer products used by millions.",
  },
  {
    id: "directors",
    label: "Design directors",
    heading: "I care about strong fundamentals — clarity, structure, and design decisions that age well.",
  },
  {
    id: "pms",
    label: "Product managers",
    heading: "I help teams turn messy, open-ended problems into clear product decisions.",
  },
  {
    id: "designers",
    label: "Product designers",
    heading: "I enjoy breaking down complex problems and shaping them into clear, usable experiences.",
  },
  {
    id: "engineers",
    label: "Engineers",
    heading: null,
  },
];

const CASE_STUDIES = [
  {
    id: "unduit",
    label: "Enterprise UX",
    title: "Guided setup that cuts support tickets.",
    href: "/case-studies/unduit",
    video: "/Animated_Spotlight_on_Laptop.mp4",
  },
  {
    id: "carforce",
    label: "Mobile App",
    title: "Service booking made simple.",
    href: "/case-studies/mobile-nav",
    video: "/1102.mp4",
  },
  {
    id: "coming1",
    label: "Design Systems",
    title: "Consistency at scale.",
    href: "#",
    video: null,
  },
  {
    id: "coming2",
    label: "B2C Product",
    title: "Coming soon.",
    href: "#",
    video: null,
  },
];

const PERSONAL_PROJECTS = [
  {
    id: "anime-motion",
    tag: "Motion Interface",
    title: "Gesture-controlled anime experience.",
    description:
      "An experimental interface inspired by anime sequences, where hand gestures trigger motion, effects, and on-screen interactions in real time.",
    cta: "View project",
    href: "/personal-projects/gesture-camera",
    visual: "from-[#10233f] via-[#143f63] to-[#0a0a0a]",
    video: "/personal-projects/gesture-anime-experience.mov",
  },
  {
    id: "portfolio-site",
    tag: "Personal Website",
    title: "This portfolio, built like a playground.",
    description:
      "A personal site where I experiment with motion, transitions, layout systems, and interaction details while documenting the things I love building.",
    cta: "Coming soon",
    href: "#",
    visual: "from-[#2b1748] via-[#5b2f69] to-[#0a0a0a]",
    video: "/personal-projects/portfolio-site-cursorful.mp4",
  },
  {
    id: "orbite-ai",
    tag: "AI Concept",
    title: "Orbite AI website concept.",
    description:
      "A vibe-coded AI web experience focused on fast prototyping, immersive visuals, and turning rough ideas into something interactive and real.",
    cta: "Coming soon",
    href: "#",
    visual: "from-[#18382d] via-[#25634f] to-[#0a0a0a]",
    video: "/personal-projects/orbite-ai-cursorful.mp4",
  },
  {
    id: "ar-cgi",
    tag: "CGI & AR",
    title: "Augmented reality and CGI experiments.",
    description:
      "A collection of visual experiments exploring CGI scenes, spatial interactions, mixed reality concepts, and immersive digital visuals.",
    cta: "Coming soon",
    href: "#",
    visual: "from-[#3b2818] via-[#7a4b2a] to-[#0a0a0a]",
    video: "/personal-projects/ar-cgi-whatsapp.mp4",
  },
];

/** Semi-transparent gradient over looping video (per card palette). */
const PERSONAL_PROJECT_VIDEO_WASH: Record<string, string> = {
  "anime-motion": "from-[#10233f]/50 via-[#143f63]/35 to-[#0a0a0a]/88",
  "portfolio-site": "from-[#2b1748]/50 via-[#5b2f69]/35 to-[#0a0a0a]/88",
  "orbite-ai": "from-[#18382d]/50 via-[#25634f]/35 to-[#0a0a0a]/88",
  "ar-cgi": "from-[#3b2818]/50 via-[#7a4b2a]/35 to-[#0a0a0a]/88",
};

const OTHER_WORK_COLUMNS = [
  {
    id: "product",
    direction: "up",
    items: [
      {
        title: "Marketplace Search",
        type: "Product UX",
        metric: "Filters, sorting, and results clarity",
        visual: "from-[#e7f0ff] via-[#f7fbff] to-[#d7e7ff]",
      },
      {
        title: "Listing Details",
        type: "Consumer App",
        metric: "Trust signals and cleaner comparison",
        visual: "from-[#fff0df] via-[#fffaf4] to-[#ffe1bf]",
      },
      {
        title: "Dealer Dashboard",
        type: "B2B Tools",
        metric: "Faster inventory decisions",
        visual: "from-[#e8fff5] via-[#f7fffb] to-[#c9f6e2]",
      },
      {
        title: "Service Flow",
        type: "Mobile UX",
        metric: "Booking steps and status updates",
        visual: "from-[#f1e9ff] via-[#fbf8ff] to-[#dfceff]",
      },
    ],
  },
  {
    id: "systems",
    direction: "down",
    items: [
      {
        title: "Design System",
        type: "Foundations",
        metric: "Tokens, components, and usage rules",
        visual: "from-[#ecfdf3] via-[#fbfffd] to-[#cff3dd]",
      },
      {
        title: "Lead Management",
        type: "Enterprise UX",
        metric: "Prioritized queues for teams",
        visual: "from-[#edf2ff] via-[#fafbff] to-[#ccd9ff]",
      },
      {
        title: "Checkout Concept",
        type: "Commerce",
        metric: "Shorter path to completion",
        visual: "from-[#fff7df] via-[#fffdf6] to-[#ffe8a3]",
      },
      {
        title: "Support Console",
        type: "Operations",
        metric: "Clearer triage and handoffs",
        visual: "from-[#ffeaf1] via-[#fff8fa] to-[#ffd2df]",
      },
    ],
  },
  {
    id: "experiments",
    direction: "up",
    items: [
      {
        title: "AI Assistant Flow",
        type: "Prototype",
        metric: "Prompt to structured workflow",
        visual: "from-[#e8f7ff] via-[#f8fdff] to-[#c9edff]",
      },
      {
        title: "Onboarding Cards",
        type: "Activation",
        metric: "Progressive guidance for new users",
        visual: "from-[#f8ecff] via-[#fefaff] to-[#ebceff]",
      },
      {
        title: "Analytics Views",
        type: "Data UX",
        metric: "Readable performance snapshots",
        visual: "from-[#effcf6] via-[#fbfffd] to-[#cceedd]",
      },
      {
        title: "Profile Builder",
        type: "Mobile App",
        metric: "Step-by-step content creation",
        visual: "from-[#fff1e7] via-[#fffaf6] to-[#ffd6bd]",
      },
    ],
  },
];

const OTHER_WORK_IMAGES = [
  {
    id: 1,
    title: "Marketplace Search",
    type: "Product UX",
    metric: "Filters, sorting, and results clarity",
    alt: "Silhouette of a traditional Japanese pagoda at sunset",
    src: "https://images.unsplash.com/photo-1512692723619-8b3e68365c9c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Listing Details",
    type: "Consumer App",
    metric: "Trust signals and cleaner comparison",
    alt: "Himeji Castle on a clear day",
    src: "https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Dealer Dashboard",
    type: "B2B Tools",
    metric: "Faster inventory decisions",
    alt: "Red car in the street",
    src: "https://images.unsplash.com/photo-1536901766856-5d45744cd180?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA2fHxqYXBhbnxlbnwwfDF8MHx8fDA%3D",
  },
  {
    id: 4,
    title: "Service Flow",
    type: "Mobile UX",
    metric: "Booking steps and status updates",
    alt: "Woman in kimono standing beside a traditional Japanese house",
    src: "https://images.unsplash.com/photo-1505069446780-4ef442b5207f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Design System",
    type: "Foundations",
    metric: "Tokens, components, and usage rules",
    alt: "Group of men in black suits inside a hallway",
    src: "https://images.unsplash.com/photo-1554797589-7241bb691973?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Lead Management",
    type: "Enterprise UX",
    metric: "Prioritized queues for teams",
    alt: "Crowd walking through a street decorated with red lanterns",
    src: "https://images.unsplash.com/photo-1596713109885-c94bdfd7f19d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    title: "Checkout Concept",
    type: "Commerce",
    metric: "Shorter path to completion",
    alt: "Timelapse of traffic lights and buildings at night",
    src: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    title: "Support Console",
    type: "Operations",
    metric: "Clearer triage and handoffs",
    alt: "Close-up of orange and black wooden torii gate posts",
    src: "https://images.unsplash.com/photo-1585028281328-54ec883cd7cf?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    title: "AI Assistant Flow",
    type: "Prototype",
    metric: "Prompt to structured workflow",
    alt: "Historic building with brown and white stone exterior in daylight",
    src: "https://images.unsplash.com/photo-1614003024056-e3ecbf8888f7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 10,
    title: "Onboarding Cards",
    type: "Activation",
    metric: "Progressive guidance for new users",
    alt: "Lantern glowing on a quiet street at night",
    src: "https://images.unsplash.com/photo-1573455494057-12684d151bf4?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 11,
    title: "Analytics Views",
    type: "Data UX",
    metric: "Readable performance snapshots",
    alt: "View of Osaka Castle with clear sky backdrop",
    src: "https://images.unsplash.com/photo-1575489129683-4f7d23379975?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 12,
    title: "Profile Builder",
    type: "Mobile App",
    metric: "Step-by-step content creation",
    alt: "Pagoda silhouetted during golden hour",
    src: "https://images.unsplash.com/photo-1512692723619-8b3e68365c9c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 13,
    title: "Saved Search",
    type: "Marketplace",
    metric: "Returning-user discovery loops",
    alt: "Himeji Castle seen from a distance",
    src: "https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 14,
    title: "Inventory Cards",
    type: "B2B",
    metric: "Scanning dense operational data",
    alt: "Torii gate pillars in vibrant orange and black",
    src: "https://images.unsplash.com/photo-1585028281328-54ec883cd7cf?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 15,
    title: "Verification UX",
    type: "Trust",
    metric: "Safer handoffs and clearer status",
    alt: "Traditional Japanese home under daylight",
    src: "https://images.unsplash.com/photo-1505069446780-4ef442b5207f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 16,
    title: "Profile Setup",
    type: "Onboarding",
    metric: "Guided completion and review",
    alt: "Women wearing kimono beside wooden house",
    src: "https://images.unsplash.com/photo-1505069446780-4ef442b5207f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 17,
    title: "Notification Center",
    type: "Consumer UX",
    metric: "Timely updates without noise",
    alt: "People passing under hanging red lanterns at dusk",
    src: "https://images.unsplash.com/photo-1596713109885-c94bdfd7f19d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 18,
    title: "Insight Cards",
    type: "Analytics",
    metric: "Readable summaries for teams",
    alt: "Stepping stone path winding through lush forest",
    src: "https://plus.unsplash.com/premium_photo-1673285285994-6bfff235db97?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

type WorkWallItem = {
  id: string;
  title: string;
  type: string;
  metric: string;
  alt: string;
  src: string;
  mediaType: "image" | "video";
};

function shuffleWorkWallItems(items: WorkWallItem[], seed: number): WorkWallItem[] {
  const out = items.slice();
  let state = seed >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const UNDUIT_WORK_MEDIA_BASE: WorkWallItem[] = [
  ...Array.from({ length: 18 }, (_, index) => {
    const itemNumber = index + 1;
    return {
      id: `unduit-work-${itemNumber}`,
      title: `Unduit screen ${itemNumber}`,
      type: "Unduit UX",
      metric: "Interface detail from the Unduit product experience.",
      alt: `Unduit product work screenshot ${itemNumber}`,
      src: `/unduit-work/unduit-work-${String(itemNumber).padStart(2, "0")}.png`,
      mediaType: "image" as const,
    };
  }),
  {
    id: "unduit-motion-1",
    title: "Unduit motion 1",
    type: "Unduit Motion",
    metric: "Prototype motion from the Unduit product experience.",
    alt: "Unduit product motion video 1",
    src: "/unduit-work/unduit-motion-01.mov",
    mediaType: "video",
  },
  {
    id: "unduit-motion-2",
    title: "Unduit motion 2",
    type: "Unduit Motion",
    metric: "Prototype motion from the Unduit product experience.",
    alt: "Unduit product motion video 2",
    src: "/unduit-work/unduit-motion-02.mov",
    mediaType: "video",
  },
  {
    id: "unduit-motion-3",
    title: "Unduit motion 3",
    type: "Unduit Motion",
    metric: "Prototype motion from the Unduit product experience.",
    alt: "Unduit product motion video 3",
    src: "/unduit-work/unduit-motion-03.mov",
    mediaType: "video",
  },
  {
    id: "unduit-motion-4",
    title: "Unduit motion 4",
    type: "Unduit Motion",
    metric: "Prototype motion from the Unduit product experience.",
    alt: "Unduit product motion video 4",
    src: "/unduit-work/unduit-motion-04.mp4",
    mediaType: "video",
  },
];

const UNDUIT_WORK_MEDIA = shuffleWorkWallItems(UNDUIT_WORK_MEDIA_BASE, 0x9e3779b9);

type CustomCursor = {
  x: number;
  y: number;
  visible: boolean;
  label: string | null;
  /** Grey pill for "Coming soon" case studies; blue for normal CTAs */
  tone: "accent" | "muted";
};

type HeroPointer = {
  x: number;
  y: number;
  active: boolean;
  lastMovedAt: number;
};

type HeroDot = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function HeroDotField({ pointerRef }: { pointerRef: RefObject<HeroPointer> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let dots: HeroDot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const setupDots = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = width < 640 ? 15 : 18;
      const containerWidth = Math.min(width, 1040);
      const containerPadding = width < 640 ? 16 : 24;
      const contentStartX = (width - containerWidth) / 2 + containerPadding;
      const startY = gap / 2;
      const xPositions: number[] = [];

      for (let x = contentStartX; x >= 0; x -= gap) {
        xPositions.unshift(x);
      }
      for (let x = contentStartX + gap; x <= width; x += gap) {
        xPositions.push(x);
      }

      dots = [];
      for (let y = startY; y <= height; y += gap) {
        for (const x of xPositions) {
          dots.push({ baseX: x, baseY: y, x, y, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const pointerIsMoving = Boolean(
        pointer?.active && performance.now() - pointer.lastMovedAt < 120
      );
      const influenceRadius = width < 640 ? 84 : 128;
      const radiusSquared = influenceRadius * influenceRadius;

      for (const dot of dots) {
        let targetX = dot.baseX;
        let targetY = dot.baseY;

        if (pointerIsMoving && pointer) {
          const dx = dot.baseX - pointer.x;
          const dy = dot.baseY - pointer.y;
          const distanceSquared = dx * dx + dy * dy;

          if (distanceSquared < radiusSquared) {
            const distance = Math.sqrt(distanceSquared) || 1;
            const force = (1 - distance / influenceRadius) ** 2;
            const push = force * 82;
            targetX += (dx / distance) * push;
            targetY += (dy / distance) * push;
          }
        }

        const ease = pointerIsMoving ? 0.16 : 0.08;
        dot.vx = 0;
        dot.vy = 0;
        dot.x += (targetX - dot.x) * ease;
        dot.y += (targetY - dot.y) * ease;

        if (!pointerIsMoving && Math.abs(dot.x - dot.baseX) < 0.02 && Math.abs(dot.y - dot.baseY) < 0.02) {
          dot.x = dot.baseX;
          dot.y = dot.baseY;
        }

        const drift = Math.hypot(dot.x - dot.baseX, dot.y - dot.baseY);
        const bottomFadeStart = height * 0.58;
        const bottomFade =
          dot.baseY < bottomFadeStart
            ? 1
            : Math.max(0, 1 - (dot.baseY - bottomFadeStart) / (height - bottomFadeStart));
        const alpha = Math.min(0.25, 0.12 + drift / 380) * bottomFade;
        context.fillStyle = `rgba(11, 11, 11, ${alpha})`;
        context.beginPath();
        context.arc(dot.x, dot.y, width < 640 ? 1.05 : 1.15, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    setupDots();
    draw();

    const resizeObserver = new ResizeObserver(setupDots);
    resizeObserver.observe(canvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [pointerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

export default function Page() {
  const pathname = usePathname();
  const carouselRef = useRef<HTMLDivElement>(null);
  const personalProjectsCarouselRef = useRef<HTMLDivElement>(null);
  const heroPointerRef = useRef<HeroPointer>({ x: 0, y: 0, active: false, lastMovedAt: 0 });
  const [activeAudience, setActiveAudience] = useState("anyone");
  const [showIntro, setShowIntro] = useState(!hasShownHomeIntroThisVisit);
  const [showExpandedWork, setShowExpandedWork] = useState(false);
  const [customCursor, setCustomCursor] = useState<CustomCursor>({
    x: 0,
    y: 0,
    visible: false,
    label: null,
    tone: "accent",
  });

  useEffect(() => {
    if (!showIntro) return;
    const timer = window.setTimeout(() => {
      setShowIntro(false);
      hasShownHomeIntroThisVisit = true;
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      setCustomCursor((cursor) => ({
        ...cursor,
        x: event.clientX,
        y: event.clientY,
        visible: true,
      }));
    };

    const handlePointerLeave = () => {
      setCustomCursor((cursor) => ({ ...cursor, visible: false }));
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    if (!showExpandedWork) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowExpandedWork(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showExpandedWork]);

  const scrollWorkSectionIntoView = useCallback(() => {
    const element = document.getElementById("work");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  /** When landing on `/#work` (link, refresh, or back), scroll after App Router has committed `/`. */
  useEffect(() => {
    if (pathname !== "/") return;
    const syncFromHash = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash !== "#work") return;
      scrollWorkSectionIntoView();
    };
    syncFromHash();
    const delayed = window.setTimeout(syncFromHash, 0);
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.clearTimeout(delayed);
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, [pathname, scrollWorkSectionIntoView]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollPersonalProjects = (direction: "left" | "right") => {
    if (!personalProjectsCarouselRef.current) return;
    const scrollAmount = 320;
    personalProjectsCarouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToWork = () => {
    if (typeof window !== "undefined" && window.location.hash !== "#work") {
      window.history.pushState(null, "", "/#work");
      window.dispatchEvent(new Event("hashchange"));
    }
    scrollWorkSectionIntoView();
  };

  const activeAudienceContent =
    AUDIENCES.find((audience) => audience.id === activeAudience) ?? AUDIENCES[0];

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    heroPointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
      lastMovedAt: performance.now(),
    };
  };

  const handleHeroPointerLeave = () => {
    heroPointerRef.current.active = false;
  };

  const setCaseStudyCursor = (label: string | null) => {
    setCustomCursor((cursor) => ({
      ...cursor,
      label,
      tone: label === "Coming soon" ? "muted" : "accent",
    }));
  };

  return (
    <div className="custom-cursor-scope min-h-screen bg-[var(--bg)] text-[var(--text)] relative">
      <div
        className={`pointer-events-none fixed left-0 top-0 z-[70] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-white transition-[width,height,opacity,transform,border-radius] duration-200 ease-out md:flex ${
          customCursor.tone === "muted"
            ? "bg-[#6b6b6b] shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
            : "bg-[#5367ff] shadow-[0_18px_40px_rgba(83,103,255,0.28)]"
        } ${
          customCursor.label
            ? "h-10 min-h-10 w-max max-w-[min(260px,calc(100vw-40px))] whitespace-nowrap px-5"
            : "h-[22px] w-[22px]"
        } ${customCursor.visible && !showExpandedWork ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${customCursor.x}px`,
          top: `${customCursor.y}px`,
        }}
        aria-hidden="true"
      >
        {customCursor.label}
      </div>

      {/* Intro overlay - stays in DOM, animates with CSS */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)] transition-all duration-700"
        style={{
          opacity: showIntro ? 1 : 0,
          transform: showIntro ? "translateY(0)" : "translateY(-30px)",
          pointerEvents: showIntro ? "auto" : "none",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-semibold text-center">
          Hello, my name is <span className="intro-name-gradient">Hamza</span>
        </h1>
      </div>

      {/* Hero section - appears as intro leaves */}
      <section
        className="min-h-[100svh] flex flex-col justify-center relative overflow-hidden"
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
      >
        <HeroDotField pointerRef={heroPointerRef} />
        <div className="container-main relative z-10 py-12 md:py-20 flex flex-col items-stretch w-full min-w-0 text-left">
          <p
            className={`${showIntro ? "hero-reveal hero-reveal-1" : "hero-reveal-now"} text-[13px] text-[var(--muted-text)] uppercase tracking-[0.15em] mb-4 md:mb-8 text-left`}
          >
            Product Designer
          </p>

          <div
            className={`${showIntro ? "hero-reveal hero-reveal-2" : "hero-reveal-now"} mb-5 md:mb-8 w-full min-w-0 overflow-x-auto overflow-y-hidden scrollbar-hide`}
          >
            <div className="inline-flex w-max flex-nowrap gap-x-1 whitespace-nowrap">
              {AUDIENCES.map((audience, index) => (
                <button
                  key={audience.id}
                  onClick={() => setActiveAudience(audience.id)}
                  className="relative shrink-0 pl-[1px] pr-3 py-2 text-[14px] transition-colors duration-150 group"
                >
                  <span className={`transition-colors duration-150 ${
                    activeAudience === audience.id
                      ? "text-[var(--text)]"
                      : "text-[var(--muted-text)] group-hover:text-[var(--text)]"
                  }`}>
                    {audience.label}
                  </span>
                  <span 
                    className={`absolute bottom-0 left-[1px] right-3 h-[2px] bg-[var(--text)] transition-transform duration-200 origin-left ${
                      activeAudience === audience.id ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  {index < AUDIENCES.length - 1 && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-[var(--subtle)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={`${showIntro ? "hero-reveal hero-reveal-3" : "hero-reveal-now"} w-full max-w-[880px]`}>
            <h1 className="text-left text-[24px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.2] md:leading-[1.15] tracking-[-0.02em]">
              {activeAudienceContent.id === "engineers" ? (
                <>
                  I&apos;m{" "}
                  <code className="font-mono whitespace-nowrap bg-[#1a1a1a] text-[#22c55e] px-2 py-1 rounded-md text-[0.85em] align-baseline">
                    deeply_technical
                  </code>{" "}
                  — and while I&apos;m not an engineer, I understand the landscape well enough to{" "}
                  <code className="font-mono whitespace-nowrap bg-[#1a1a1a] text-[#60a5fa] px-2 py-1 rounded-md text-[0.85em] align-baseline">
                    collaborate()
                  </code>{" "}
                  and contribute meaningfully.
                </>
              ) : (
                activeAudienceContent.heading
              )}
            </h1>
          </div>

          <div
            className={`${showIntro ? "hero-reveal hero-reveal-4" : "hero-reveal-now"} mt-4 md:mt-10 w-full flex justify-start`}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-left text-[15px] text-[var(--muted-text)] hover:text-[var(--text)] transition-colors shrink-0 whitespace-nowrap"
            >
              <span>Get in touch</span>
              <span className="text-[var(--accent)]">→</span>
            </Link>
          </div>
        </div>

        <button
          onClick={scrollToWork}
          className={`${showIntro ? "hero-reveal hero-reveal-5" : "hero-reveal-now"} absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--muted-text)] hover:text-[var(--text)] cursor-pointer`}
          aria-label="Scroll to work"
        >
          <span className="text-[12px] uppercase tracking-widest">Work</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </section>

      <section id="work" className="section-gap scroll-mt-20">
        <div className="container-main">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-end justify-between mb-[var(--space-l)]">
              <div>
                <small className="label block mb-[var(--space-xxs)]">Selected work</small>
                <h2 className="h2">Case <span className="text-[var(--accent)]">Studies.</span></h2>
              </div>
              <div className="hidden md:flex gap-2">
                <button onClick={() => scroll("left")} className="p-2 rounded-full border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors" aria-label="Scroll left">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scroll("right")} className="p-2 rounded-full border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors" aria-label="Scroll right">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div ref={carouselRef} className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex gap-5 px-[max(24px,calc((100vw-var(--container-max))/2+24px))] pb-2">
            {CASE_STUDIES.map((study, index) => (
              <Link 
                key={study.id} 
                href={study.href} 
                onClick={(event) => {
                  if (study.href === "#") {
                    event.preventDefault();
                  }
                }}
                onPointerEnter={() =>
                  setCaseStudyCursor(study.href === "#" ? "Coming soon" : "View case study")
                }
                onPointerLeave={() => setCaseStudyCursor(null)}
                className="group flex-shrink-0 w-[320px] cursor-none md:w-[380px]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative h-[450px] md:h-[500px] rounded-2xl overflow-hidden bg-[#0a0a0a]"
                >
                  {study.video ? (
                    <ViewportVideo
                      className="absolute inset-0 w-full h-full object-cover"
                      src={study.video}
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <small className="text-[11px] text-white/50 uppercase tracking-[0.15em] mb-2">{study.label}</small>
                    <h3 className="text-[20px] md:text-[24px] font-semibold text-white leading-tight max-w-[280px]">
                      {study.title}
                    </h3>
                    {study.href === "#" && (
                      <span className="text-white/30 text-[13px] mt-2">Coming Soon</span>
                    )}
                  </div>
                  
                  {study.href !== "#" && (
                    <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  {/* Platform chip — Desktop / App */}
                  {(study.id === "unduit" || study.id === "carforce") && (
                    <div className="absolute top-5 left-5 flex items-center gap-2">
                      <span className="inline-flex w-fit items-center rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md">
                        {study.id === "unduit" ? "Desktop" : "App"}
                      </span>
                      {study.id === "carforce" && (
                        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#111] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md">
                          <span>In Progress</span>
                          <span className="font-bold text-amber-600">75%</span>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="personal-projects" className="section-gap scroll-mt-20">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-end justify-between mb-[var(--space-l)]">
              <div>
                <small className="label block mb-[var(--space-xxs)]">Stuff I build outside of work.</small>
                <h2 className="h2">
                  Personal <span className="text-[var(--accent)]">Projects.</span>
                </h2>
                <p className="body-text mt-[var(--space-xs)] max-w-[640px]">
                  A mix of experiments, interface studies, and late night ideas brought to life through motion, AI tools,
                  code, and design. Some are polished, some are chaotic, but all of them helped me explore how digital
                  experiences can feel more alive.
                </p>
              </div>
              <div className="hidden md:flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollPersonalProjects("left")}
                  className="p-2 rounded-full border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors"
                  aria-label="Scroll personal projects left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollPersonalProjects("right")}
                  className="p-2 rounded-full border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors"
                  aria-label="Scroll personal projects right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div ref={personalProjectsCarouselRef} className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex gap-5 px-[max(24px,calc((100vw-var(--container-max))/2+24px))] pb-2">
            {PERSONAL_PROJECTS.map((project, index) => (
              <Link
                key={project.id}
                href={project.href}
                onClick={(event) => {
                  if (project.href === "#") {
                    event.preventDefault();
                  }
                }}
                onPointerEnter={() =>
                  setCaseStudyCursor(project.href === "#" ? "Coming soon" : project.cta)
                }
                onPointerLeave={() => setCaseStudyCursor(null)}
                className="group flex-shrink-0 w-[320px] cursor-none md:w-[380px]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative h-[450px] md:h-[500px] rounded-2xl overflow-hidden bg-[#0a0a0a]"
                >
                  {"video" in project && project.video ? (
                    <video
                      className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
                      src={project.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 z-[1] bg-gradient-to-br ${
                      "video" in project && project.video
                        ? PERSONAL_PROJECT_VIDEO_WASH[project.id] ??
                          "from-[#10233f]/50 via-[#143f63]/35 to-[#0a0a0a]/88"
                        : project.visual
                    }`}
                  />
                  <div className="absolute inset-0 z-[1] opacity-30 [background-image:radial-gradient(circle_at_24px_24px,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/92 via-black/45 to-transparent" />

                  <div className="absolute top-5 left-5 z-[2]">
                    <span className="inline-flex w-fit rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md">
                      {project.tag}
                    </span>
                  </div>

                  {project.href !== "#" && (
                    <div className="absolute top-5 right-5 z-[2] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                      <ChevronRight className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 z-[2] flex flex-col justify-end">
                    <div className="relative px-6 pb-6 pt-20 md:pt-24">
                      <div
                        className="pointer-events-none absolute inset-0 rounded-b-2xl bg-gradient-to-t from-[#000000]/90 to-[#000000]/0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                        aria-hidden
                      />
                      <div className="relative">
                        <h3 className="text-[20px] md:text-[24px] font-semibold text-white leading-tight max-w-[300px] drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]">
                          {project.title}
                        </h3>
                        {project.href === "#" && (
                          <span className="mt-2 block text-[13px] text-white/80 md:text-[14px]">
                            Coming soon
                          </span>
                        )}
                        <p className="mt-0 max-h-0 max-w-[320px] overflow-hidden text-[13px] leading-relaxed text-white opacity-0 transition-[max-height,opacity,margin] duration-300 ease-out group-hover:mt-3 group-hover:max-h-[220px] group-hover:overflow-y-auto group-hover:opacity-100 md:text-[14px]">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap overflow-hidden bg-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mb-[var(--space-l)] flex max-w-[920px] flex-col items-center gap-5 text-center"
          >
            <div>
              <small className="label block mb-[var(--space-xxs)]">More selected work</small>
              <h2 className="h2">My other <span className="text-[var(--accent)]">work?</span></h2>
              <p className="body-text mx-auto mt-[var(--space-xs)] md:whitespace-nowrap">
                A moving wall of product screens, experiments, and system work across mobile, web, and internal tools.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowExpandedWork(true)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--subtle)] bg-[var(--bg)] px-5 py-3 text-[14px] font-medium text-[var(--text)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--muted-text)] hover:shadow-md"
            >
              See expanded view
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <div className="relative h-[640px] w-full overflow-hidden bg-white px-4 py-5 md:px-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-white to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-white to-transparent" />

          <div className="grid h-full grid-cols-5 gap-3 bg-white md:gap-5">
            {Array.from({ length: 5 }).map((_, columnIndex) => {
              const columnItems = UNDUIT_WORK_MEDIA.filter((_, itemIndex) => itemIndex % 5 === columnIndex);
              const direction = columnIndex % 3 === 1 ? "down" : "up";

              return (
                <div
                  key={`preview-column-${columnIndex}`}
                  className="other-work-column relative isolate h-full min-h-0 overflow-hidden bg-white"
                >
                  <div
                    className={`flex min-h-0 flex-col gap-4 bg-white ${
                      direction === "down" ? "other-work-marquee-reverse" : "other-work-marquee"
                    }`}
                    style={{ animationDuration: `${30 + columnIndex * 4}s` }}
                  >
                    {[...columnItems, ...columnItems].map((item, itemIndex) => (
                      <article
                        key={`preview-${columnIndex}-${item.title}-${itemIndex}`}
                        className="group relative aspect-video overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
                      >
                        {item.mediaType === "video" ? (
                          <ViewportVideo
                            src={item.src}
                            className="pointer-events-none absolute inset-0 h-full w-full bg-white object-cover"
                            muted
                            loop
                            playsInline
                            preload="none"
                            aria-label={item.alt}
                          />
                        ) : (
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="(min-width: 768px) 320px, 33vw"
                            className="pointer-events-none bg-white object-cover"
                          />
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {showExpandedWork && (
        <div
          className="native-cursor-scope fixed inset-0 z-[100000] bg-black/65 text-white backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded work gallery"
        >
          <div className="absolute inset-y-[5vh] left-5 right-5 overflow-hidden rounded-[28px] border border-white/15 bg-[#141414] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between bg-gradient-to-b from-black/85 to-transparent p-5 md:p-8">
              <div className="max-w-[760px]">
                <small className="block text-[12px] font-semibold uppercase tracking-[0.2em] text-white/55">
                  Expanded view
                </small>
                <h2 className="mt-2 text-[34px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[72px]">
                  My work
                </h2>
                <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-white/65 md:text-[16px]">
                  Drag anywhere to explore the expanded wall of selected product screens.
                </p>
                <span className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur">
                  Drag to view
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowExpandedWork(false)}
                className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
                aria-label="Close expanded view"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <DraggableContainer variant="masonry">
              <GridBody>
                {UNDUIT_WORK_MEDIA.map((image) => (
                  <GridItem
                    key={image.id}
                    className="group relative aspect-video h-auto w-[340px] md:w-[560px]"
                  >
                    {image.mediaType === "video" ? (
                      <ViewportVideo
                        src={image.src}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label={image.alt}
                      />
                    ) : (
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 768px) 560px, 340px"
                        className="pointer-events-none object-cover"
                      />
                    )}
                  </GridItem>
                ))}
              </GridBody>
            </DraggableContainer>
          </div>
        </div>
      )}

      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-[640px]"
          >
            <small className="label block mb-[var(--space-xxs)]">About</small>
            <h2 className="h2 mb-[var(--space-xs)]">About</h2>
            <p className="body-text mb-[var(--space-s)]">
              Product Designer at Dubizzle Group with experience across B2C, B2B, and enterprise SaaS. I focus on reducing friction and making decisions obvious.
            </p>
            <Link href="/contact" className="text-[var(--accent)] text-[15px] hover:underline">
              Get in touch →
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-[var(--space-m)] border-t border-[var(--subtle)]">
        <div className="container-main">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-[var(--muted-text)]">
            <p>© 2026 Hamza Ayaz</p>
            <div className="flex gap-[var(--space-m)]">
              <a href="https://www.linkedin.com/in/muhammadhamzaayaz/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors">LinkedIn</a>
              <a href="mailto:hamzaayaz53@gmail.com" className="hover:text-[var(--text)] transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
