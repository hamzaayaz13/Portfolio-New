"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

type CardKind = "photo" | "about" | "contact";

type CardConfig = {
  id: CardKind;
  label: string;
  title: string;
  description: string;
};

const cards: CardConfig[] = [
  {
    id: "photo",
    label: "Location",
    title: "Based in Dubai",
    description: "Editorial photo card placeholder.",
  },
  {
    id: "about",
    label: "About",
    title: "Hamza Ayaz",
    description:
      "Product designer with experience across B2C, B2B, and enterprise SaaS. I shape clear product experiences that reduce friction and build trust.",
  },
  {
    id: "contact",
    label: "Contact",
    title: "Start a conversation",
    description: "Choose the best way to connect.",
  },
];

const ctas = [
  {
    title: "Email",
    subtitle: "hamzaayaz53@gmail.com",
    href: "mailto:hamzaayaz53@gmail.com",
    iconPath: "M4 6.5h16v11H4z M4.5 7l7.5 6 7.5-6",
  },
  {
    title: "LinkedIn",
    subtitle: "Connect with me",
    href: "https://www.linkedin.com/in/muhammadhamzaayaz/",
    iconPath:
      "M6.5 9.5v8 M6.5 6.5v.1 M10.5 17.5v-8 M10.5 13c0-2 1.25-3.5 3.25-3.5 1.85 0 3.25 1.25 3.25 3.75v4.25",
  },
  {
    title: "Resume",
    subtitle: "View PDF",
    href: "/Resume/Hamza%20Ayaz%20-%20CV(R)%20.pdf",
    iconPath: "M7 3.5h7l3 3v14H7z M14 3.5v3h3 M9.5 11.5h5 M9.5 15h5",
  },
];

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CONTACT_HERO_IMAGE = "/contact-scroll/hero-design-room.png";

/** Less vertical distance before progress hits 1 (was 300vh). */
const CONTACT_SCROLL_HEIGHT_VH = 165;
/**
 * Map springed scroll progress so motion reaches "done" by this fraction of 0–1,
 * then holds the final state for the rest of the section scroll.
 */
const SCROLL_PROGRESS_FULL = 0.64;

function UnifiedImageSlice({ index }: { index: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0a]">
      <div
        className="absolute top-0 h-full"
        style={{
          width: "300%",
          left: `${-index * 100}%`,
        }}
      >
        <div className="relative h-full w-full">
          <Image
            src={CONTACT_HERO_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 768px) 960px, 90vw"
            priority={index === 0}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-black/15 to-black/35" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
    </div>
  );
}

function RevealedCardContent({
  card,
  contentOpacity,
  contentY,
}: {
  card: CardConfig;
  contentOpacity: MotionValue<number>;
  contentY: MotionValue<number>;
}) {
  if (card.id === "photo") {
    return (
      <>
        <Image
          src="/Images/carforce/own-picture.jpeg"
          alt="Hamza Ayaz"
          fill
          sizes="(min-width: 768px) 320px, 82vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-transparent to-black/10" />
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-[12px] font-medium text-white backdrop-blur-xl"
        >
          Based in Dubai
        </motion.div>
      </>
    );
  }

  if (card.id === "about") {
    return (
      <div className="flex h-full flex-col justify-end bg-[radial-gradient(circle_at_50%_0%,rgba(25,118,210,0.38),transparent_42%),linear-gradient(180deg,#171717,#060606)] p-6 md:p-8">
        <motion.div style={{ opacity: contentOpacity, y: contentY }}>
          <small className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8ecaff]">
            {card.label}
          </small>
          <h3 className="mt-4 text-[32px] font-semibold leading-none tracking-[-0.04em] text-white md:text-[44px]">
            {card.title}
          </h3>
          <p className="mt-5 text-[14px] leading-relaxed text-white/68 md:text-[16px]">
            {card.description}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-end bg-[linear-gradient(180deg,#151515,#050505)] p-4 md:p-6">
      <motion.div style={{ opacity: contentOpacity, y: contentY }}>
        <small className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
          {card.label}
        </small>
        <h3 className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.035em] text-white">
          Contact
        </h3>
        <div className="mt-6 space-y-3">
          {ctas.map((cta) => (
            <a
              key={cta.title}
              href={cta.href}
              target={cta.href.startsWith("http") || cta.href.endsWith(".pdf") ? "_blank" : undefined}
              rel={cta.href.startsWith("http") || cta.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3.5 text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.12] md:gap-4 md:p-4"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#8bc5ff] md:h-10 md:w-10">
                <Icon path={cta.iconPath} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold md:text-[15px]">{cta.title}</span>
                <span className="block truncate text-[12px] text-white/48">{cta.subtitle}</span>
              </span>
              <span className="text-white/45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white">
                <ArrowIcon />
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SplitCard({
  card,
  index,
  progress,
}: {
  card: CardConfig;
  index: number;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [0.12, 0.42], [0, index === 0 ? -28 : index === 2 ? 28 : 0]);
  const y = useTransform(progress, [0.26, 0.58], [0, index === 1 ? -16 : 20]);
  const rotateY = useTransform(progress, [0.30, 0.52], [0, index === 0 ? -180 : index === 2 ? 180 : 180]);
  const rotateZ = useTransform(progress, [0.16, 0.58], [0, index === 0 ? -7 : index === 2 ? 7 : 0]);
  const scale = useTransform(progress, [0.08, 0.58], [1, index === 1 ? 1.02 : 0.96]);
  const gapRadiusLeft = useTransform(progress, [0.10, 0.34], [index === 0 ? 32 : 0, 32]);
  const gapRadiusRight = useTransform(progress, [0.10, 0.34], [index === 2 ? 32 : 0, 32]);
  const frontOpacity = useTransform(progress, [0.42, 0.56], [1, 0]);
  const backOpacity = useTransform(progress, [0.44, 0.58], [0, 1]);
  const contentOpacity = useTransform(progress, [0.52, 0.72], [0, 1]);
  const contentY = useTransform(progress, [0.52, 0.72], [34, 0]);

  return (
    <motion.article
      className={`relative h-[360px] w-[28vw] min-w-[104px] max-w-[320px] shrink-0 border border-white/10 bg-[#101010] shadow-[0_34px_90px_rgba(0,0,0,0.45)] will-change-transform sm:min-w-[180px] md:h-[480px] ${
        card.id === "about" ? "z-20 shadow-[0_34px_110px_rgba(25,118,210,0.24)]" : "z-10"
      }`}
      style={{
        x,
        y,
        rotateY,
        rotateZ,
        scale,
        borderTopLeftRadius: gapRadiusLeft,
        borderBottomLeftRadius: gapRadiusLeft,
        borderTopRightRadius: gapRadiusRight,
        borderBottomRightRadius: gapRadiusRight,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: frontOpacity,
          backfaceVisibility: "hidden",
          borderTopLeftRadius: gapRadiusLeft,
          borderBottomLeftRadius: gapRadiusLeft,
          borderTopRightRadius: gapRadiusRight,
          borderBottomRightRadius: gapRadiusRight,
        }}
      >
        <UnifiedImageSlice index={index} />
      </motion.div>

      <motion.div
        className="absolute inset-0 overflow-hidden rounded-[32px]"
        style={{
          opacity: backOpacity,
          rotateY: 180,
          backfaceVisibility: "hidden",
        }}
      >
        <RevealedCardContent card={card} contentOpacity={contentOpacity} contentY={contentY} />
      </motion.div>
    </motion.article>
  );
}

export default function ScrollRevealCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressSpring = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 22,
    mass: 0.32,
  });

  const progress = useTransform(progressSpring, [0, SCROLL_PROGRESS_FULL], [0, 1]);

  const stageGap = useTransform(progress, [0.10, 0.32], ["0px", "28px"]);
  const stageY = useTransform(progress, [0, 0.62], [24, -6]);
  const stageScale = useTransform(progress, [0, 0.62], [0.96, 1]);
  const glowOpacity = useTransform(progress, [0, 0.62], [0.18, 0.42]);
  const scrollHintOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  const scrollHintY = useTransform(progress, [0, 0.12], [0, -16]);
  const captionOpacity = useTransform(progress, [0, 0.32], [1, 0]);

  return (
    <section ref={containerRef} className="relative bg-black text-white" style={{ height: `${CONTACT_SCROLL_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 py-16">
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(25,118,210,0.28),transparent_38%),linear-gradient(180deg,#050505,#000)]"
          style={{ opacity: glowOpacity }}
        />

        <div className="relative flex h-full w-full max-w-[1120px] flex-col items-center justify-center">
          <motion.div
            className="absolute top-[9vh] z-30 flex flex-col items-center gap-3 text-center"
            style={{ opacity: scrollHintOpacity, y: scrollHintY }}
          >
            <p className="font-serif text-[15px] font-normal tracking-[0.12em] text-white/55 md:text-[16px]">
              Scroll down
            </p>
            <ChevronDown
              className="h-6 w-6 text-white/70 animate-bounce md:h-7 md:w-7"
              aria-hidden
            />
          </motion.div>

          <motion.div
            className="flex w-full flex-col items-center"
            style={{ y: stageY, scale: stageScale }}
          >
            <motion.div
              className="relative flex h-[520px] w-full items-center justify-center overflow-visible"
              style={{
                gap: stageGap,
                perspective: 1200,
                transformStyle: "preserve-3d",
              }}
            >
              {cards.map((card, index) => (
                <SplitCard key={card.id} card={card} index={index} progress={progress} />
              ))}
            </motion.div>
            <motion.p
              style={{ opacity: captionOpacity }}
              className="mt-7 max-w-[min(520px,92vw)] px-3 text-center font-serif text-[16px] leading-snug tracking-[0.01em] text-white md:mt-8 md:text-[17px]"
            >
              Yep, that&apos;s me. At the Dubizzle HQ. In the zone.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
