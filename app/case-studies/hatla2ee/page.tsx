'use client';

import React, { useRef, useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';

const satoshi = localFont({
  src: [
    { path: '../../../public/fonts/satoshi/Satoshi-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../../public/fonts/satoshi/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/satoshi/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/satoshi/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../../public/fonts/satoshi/Satoshi-Black.woff2', weight: '900', style: 'normal' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

/* ==================================================================
   DESIGN TOKENS
   ================================================================== */
const ease = [0.22, 1, 0.36, 1] as const;
const MAXW = 'mx-auto max-w-[1120px] px-6 md:px-10';
const SECTION_GAP = 'mt-24 md:mt-36';
const TILE = 'bg-[#f4f4f4]';
const CARD = 'bg-[#f7f7f7] border border-black/[0.05]';

const FIGMA_PROTOTYPE_URL: string | null = 'https://embed.figma.com/proto/9ggzZhYeeyWmpWolws6V7L/Untitled?node-id=296-18016&scaling=scale-down-width&content-scaling=fixed&page-id=274%3A31277&starting-point-node-id=296%3A18016&embed-host=share&hide-ui=1&hotspot-hints=1&footer=false';
const FIGMA_CANVAS_URL: string | null = 'https://embed.figma.com/design/9ggzZhYeeyWmpWolws6V7L/Maintenance-Case-Study?node-id=274-31277&embed-host=share';

/* ==================================================================
   PRIMITIVES
   ================================================================== */
function FadeIn({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${MAXW} ${className}`}>{children}</div>;
}

function SectionHead({
  index,
  label,
  title,
  lead,
  className = '',
}: {
  index: string;
  label: string;
  title: string;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="text-[12px] tabular-nums text-[#c2c2c2]">{index}</span>
        <span className="h-px w-8 bg-[#e2e2e2]" />
        <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#999]">{label}</span>
      </div>
      <h2 className="mt-5 max-w-[20ch] text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] md:text-[32px]">
        {title}
      </h2>
      {lead && (
        <p className="mt-6 max-w-[64ch] text-[15px] leading-[1.75] text-[#575757] md:text-[16px]">
          {lead}
        </p>
      )}
    </div>
  );
}

/* ==================================================================
   COMPARISON DATA (Section 4) — only 3
   ================================================================== */
const COMPARISONS = [
  {
    label: '01',
    title: 'Finding Maintenance',
    body: 'The feature became easier to discover, making it quicker for users to access what they were looking for.',
    image: '/Images/Finding Maintenance.png',
  },
  {
    label: '02',
    title: 'Adding Your Car',
    body: 'The journey became shorter by removing unnecessary questions and simplifying the flow.',
    image: '/Images/Adding Your Car.png',
  },
  {
    label: '03',
    title: 'Logging a Service',
    body: 'Common services became quick selections, reducing typing while keeping flexibility through custom entries.',
    image: '/Images/Logging a Service.png',
  },
];

/* ==================================================================
   PRINCIPLE CARDS (Section 3) — only 3 with images
   ================================================================== */
const PRINCIPLES = [
  {
    num: '01',
    title: "Removed What Didn't Matter",
    body: 'Only the information that helped users complete their task or benefited the business was kept. Everything else was removed.',
    image: '/Images/Removed what didnt matter.png',
  },
  {
    num: '02',
    title: 'Replaced Typing With Choosing',
    body: 'Historical maintenance data was analysed to identify the services people used most. These became quick selections while still allowing custom entries.',
    image: '/Images/Replaced Typing With Choosing.png',
  },
  {
    num: '03',
    title: 'Made Reminders Easier',
    body: "Instead of only offering a 12-month reminder or a custom date, users can now choose 3, 6 or 12 months and immediately see exactly when they'll be reminded.",
    image: '/Images/Made Reminders Easier.png',
  },
];

const HERO_META = [
  { label: 'Role', value: 'Product Designer' },
  { label: 'Timeline', value: 'Reprioritised post-launch' },
  { label: 'Responsibilities', value: 'UX · UI · Prototyping · QA' },
  { label: 'Team', value: '1 PM · Design · Engineering' },
];

/* ==================================================================
   PAGE
   ================================================================== */
export default function Hatla2eeCaseStudy() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState('Overview');
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(Math.round(v * 100)));

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setNavVisible(y < 100 || y < lastScrollY.current);
    lastScrollY.current = y;

    const sections = pageRef.current?.querySelectorAll<HTMLElement>('[data-section]');
    if (!sections) return;
    let active = 'Overview';
    for (const el of sections) {
      if (el.getBoundingClientRect().top <= 200) {
        active = el.dataset.section || active;
      }
    }
    setCurrentSection(active);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (FIGMA_PROTOTYPE_URL) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://embed.figma.com';
      document.head.appendChild(link);

      const iframe = document.createElement('iframe');
      iframe.src = FIGMA_PROTOTYPE_URL;
      iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none';
      document.body.appendChild(iframe);

      return () => {
        document.head.removeChild(link);
        document.body.removeChild(iframe);
      };
    }
  }, []);

  return (
    <main
      ref={pageRef}
      className={`relative bg-white text-[#111] ${satoshi.variable} [font-family:var(--font-satoshi),ui-sans-serif,system-ui]`}
    >
      {/* Navbar hide on scroll down */}
      <style>{`
        .floating-nav-wrap { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease; }
        .floating-nav-wrap.nav-hidden { transform: translateY(-120%); opacity: 0; }
      `}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
            var last=0;
            window.addEventListener('scroll',function(){
              var y=window.scrollY;
              var el=document.querySelector('.floating-nav-wrap');
              if(!el)return;
              if(y>100&&y>last){el.classList.add('nav-hidden')}else{el.classList.remove('nav-hidden')}
              last=y;
            },{passive:true});
          })();`,
        }}
      />

      {/* Progress badge — bottom left */}
      <div className="pointer-events-none fixed bottom-6 left-6 z-30 hidden lg:flex">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-[#111] px-4 py-2 text-white shadow-lg">
          <span className="text-[12px] font-medium">{currentSection}</span>
          <span className="h-3 w-px bg-white/25" />
          <span className="text-[12px] tabular-nums text-white/85">{progress}%</span>
        </div>
      </div>

      {/* ================================================================
          S1 — HERO
          ================================================================ */}
      <section className="pt-32 md:pt-40" data-section="Overview">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#999]">
                Hatla2ee — Maintenance
              </span>
              <span className="h-px w-8 bg-[#e2e2e2]" />
              <span className="text-[12px] uppercase tracking-[0.16em] text-[#c2c2c2]">Case study</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.05} className="mt-8">
            <div className="relative overflow-hidden rounded-2xl bg-[#f4f4f4]">
              <div className="relative aspect-[16/9] w-full">
                <Image src="/Images/header.png" alt="Hatla2ee Maintenance" fill className="object-cover" />
              </div>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <FadeIn>
                <h1 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] md:text-[42px]">
                  Redesigning the Car Maintenance Experience
                </h1>
                <p className="mt-7 max-w-[58ch] text-[15px] leading-[1.75] text-[#575757] md:text-[16px]">
                  A complete redesign of Hatla2ee&apos;s Maintenance experience — from
                  discovering the feature to logging services and tracking reminders.
                  Every journey was simplified to reduce effort, save time, and make car
                  maintenance easier to manage.
                </p>
              </FadeIn>
            </div>

            <div className="md:col-span-5">
              <FadeIn delay={0.05}>
                <dl className="border-t border-black/[0.08]">
                  {HERO_META.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-baseline justify-between gap-4 border-b border-black/[0.08] py-4"
                    >
                      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#999]">
                        {item.label}
                      </dt>
                      <dd className="text-right text-[14px] leading-[1.5] text-[#111]">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================
          S2 — WHY THIS PROJECT MATTERED
          ================================================================ */}
      <section className={SECTION_GAP} data-section="People Wanted It Back">
        <Container>
          <FadeIn>
            <SectionHead
              index="01"
              label="Why this project mattered"
              title="People Wanted It Back."
              lead={
                <>
                  When Hatla2ee launched its redesigned app, the Maintenance feature
                  wasn&apos;t included. Although it served a smaller audience, users
                  relied on it and continued requesting it through Play Store reviews.
                  What started as a visual refresh became an opportunity to redesign the
                  entire experience.
                </>
              }
            />
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="mt-14 overflow-hidden rounded-2xl border border-black/[0.05]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Images/reviews.svg"
                alt="Play Store reviews requesting maintenance feature"
                className="w-full h-auto"
              />
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ================================================================
          S3 — THE NEW EXPERIENCE
          ================================================================ */}
      <section className={SECTION_GAP} data-section="The New Experience">
        <Container>
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-6">
              <FadeIn>
                <SectionHead
                  index="02"
                  label="The new experience"
                  title="Explore the Redesigned Experience."
                  lead={
                    <>
                      From discovering the feature to adding a car, logging services,
                      setting reminders and tracking maintenance history, every part of
                      the journey was redesigned into one connected experience.
                    </>
                  }
                />
              </FadeIn>
            </div>

            <div className="flex items-center justify-center md:col-span-6">
              <FadeIn delay={0.1}>
                <div className="relative w-[320px] aspect-[9/19.3] rounded-[2.8rem] bg-[#0a0a0a] p-[10px] shadow-[0_40px_60px_-20px_rgba(0,0,0,0.3)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-white">
                    <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-[22px] w-[88px] -translate-x-1/2 rounded-full bg-black" />
                    {FIGMA_PROTOTYPE_URL ? (
                      <iframe
                        src={FIGMA_PROTOTYPE_URL}
                        className="absolute inset-0 h-full w-full border-0"
                        allow="fullscreen"
                        title="Figma prototype"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#F5F1EE] via-white to-[#FBEEE7]">
                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#c9b8ad]">
                          Figma prototype
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      {/* ================================================================
          PRODUCT PHILOSOPHY
          ================================================================ */}
      <section className={SECTION_GAP} data-section="Product Philosophy">
        <Container>
          <FadeIn>
            <p className="max-w-[52ch] text-[22px] font-medium leading-[1.4] tracking-[-0.015em] text-[#111] md:text-[28px]">
              Every decision that follows had one goal: make car maintenance easier
              to manage.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* ================================================================
          S3 — DESIGN DECISIONS (3 cards with images)
          ================================================================ */}
      <section className={SECTION_GAP} data-section="Design Decisions">
        <Container>
          <FadeIn>
            <SectionHead
              index="03"
              label="Design decisions"
              title="Every Decision Had a Purpose."
              lead={
                <>
                  Every improvement solved a real problem — whether it reduced effort
                  for users, supported business goals, or made the product easier to
                  build and maintain.
                </>
              }
            />
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  className={`flex flex-col overflow-hidden rounded-2xl ${CARD}`}
                >
                  <div className="flex h-[178px] w-full items-center justify-center bg-[#f4f4f4]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.title} className="h-full w-full object-contain p-4" />
                  </div>
                  <div className="p-7 md:p-8">
                    <h3 className="whitespace-nowrap text-[17px] font-semibold leading-snug text-[#111] md:text-[18px]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[#6a6a6a]">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ================================================================
          S4 — FROM OLD TO BETTER (sticky scroll, 3 comparisons)
          ================================================================ */}
      <StickyComparisons />

      {/* ================================================================
          S5 — DESIGNED FOR REAL LIFE (tabbed)
          ================================================================ */}
      <section className={SECTION_GAP} data-section="Beyond the Happy Path">
        <Container>
          <FadeIn>
            <SectionHead
              index="05"
              label="Designed for real life"
              title="Beyond the Happy Path."
              lead={
                <>
                  Real products need to work beyond ideal scenarios. From missing images
                  and overdue reminders to empty states and multiple cars, every
                  foreseeable state was designed to keep the experience reliable and
                  consistent while giving engineers clear guidance during implementation.
                </>
              }
            />
          </FadeIn>

          <FadeIn delay={0.05}>
            <EdgeCaseTabs />
          </FadeIn>
        </Container>
      </section>

      {/* ================================================================
          S6 — BEHIND THE DESIGN (Figma canvas)
          ================================================================ */}
      <section className={SECTION_GAP} data-section="Behind the Design">
        <Container>
          <FadeIn>
            <SectionHead
              index="06"
              label="Behind the design"
              title="How the Work Comes Together."
              lead={
                <>
                  Every screen starts with exploration, iteration and collaboration.
                  The Figma file captures the thinking behind the product — from early
                  ideas to developer-ready designs.
                </>
              }
            />
          </FadeIn>

          <FadeIn delay={0.05}>
            <div className={`mt-14 overflow-hidden rounded-2xl ${CARD}`}>
              {FIGMA_CANVAS_URL ? (
                <div className="relative aspect-[16/9] w-full select-none overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
                  <iframe
                    src={FIGMA_CANVAS_URL + '&hide-ui=1'}
                    className="absolute border-0"
                    style={{ top: '-56px', left: 0, width: '100%', height: 'calc(100% + 120px)' }}
                    title="Figma design canvas"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="pointer-events-none absolute inset-0 z-10" />
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center">
                  <div className="text-center">
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#b0b0b0]">
                      Figma canvas
                    </span>
                    <p className="mt-2 text-[12px] text-[#c2c2c2]">
                      Add your Figma URL to{' '}
                      <code className="rounded bg-black/5 px-1.5 py-0.5">FIGMA_CANVAS_URL</code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* ================================================================
          CLOSING STATEMENT
          ================================================================ */}
      <section className="mt-24 md:mt-36">
        <Container>
          <div className="border-t border-black/[0.08]">
            <FadeIn>
              <div className="flex items-center justify-center py-24 md:py-36">
                <p className="max-w-[46ch] text-center text-[22px] font-medium leading-[1.45] tracking-[-0.015em] text-[#111] md:text-[28px]">
                  The best products aren&apos;t the ones people notice. They&apos;re
                  the ones that quietly help people get things done.
                </p>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Footer nav */}
      <nav className="border-t border-black/[0.08] py-8">
        <Container className="flex items-center justify-between">
          <Link href="/" className="text-[13px] text-[#111] transition-colors hover:text-[#999]">
            &larr; Home
          </Link>
          <Link href="/case-studies/unduit" className="text-[13px] text-[#111] transition-colors hover:text-[#999]">
            Unduit Refresh &rarr;
          </Link>
        </Container>
      </nav>
    </main>
  );
}

/* ==================================================================
   STICKY SCROLL COMPARISONS (Section 4) — 3 items
   ================================================================== */
function StickyComparisons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(COMPARISONS.length - 1, Math.floor(v * COMPARISONS.length));
    setActiveIndex(idx);
  });

  const active = COMPARISONS[activeIndex];

  return (
    <section
      ref={containerRef}
      className={SECTION_GAP}
      data-section="Small Changes. Better Experience"
      style={{ height: `${COMPARISONS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex min-h-screen items-center">
        <Container className="w-full">
          <div className="flex items-center gap-3">
            <span className="text-[12px] tabular-nums text-[#c2c2c2]">04</span>
            <span className="h-px w-8 bg-[#e2e2e2]" />
            <span className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#999]">From old to better</span>
          </div>

          <h2 className="mt-5 max-w-[20ch] text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] md:text-[32px]">
            Small Changes. Better Experience.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="mb-9 flex gap-2">
                {COMPARISONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      i <= activeIndex ? 'bg-[#111]' : 'bg-[#e2e2e2]'
                    }`}
                  />
                ))}
              </div>

              <p className="text-[12px] tabular-nums text-[#c2c2c2]">
                {active.label} / {String(COMPARISONS.length).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-[22px] font-semibold leading-[1.2] tracking-[-0.01em] md:text-[26px]">
                {active.title}
              </h3>

              <p className="mt-6 text-[15px] leading-[1.7] text-[#575757]">{active.body}</p>
            </div>

            <div className="flex items-center justify-center md:col-span-7">
              <div className={`relative w-full overflow-hidden rounded-2xl ${TILE} aspect-[4/3]`}>
                <div className="absolute inset-x-0 top-[25%] flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={active.image}
                    alt={active.title}
                    className="w-[260px] md:w-[380px] h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ==================================================================
   EDGE CASE TABS (Section 5)
   ================================================================== */
function EdgeCaseTabs() {
  const [activeTab, setActiveTab] = useState<'service' | 'car'>('service');

  return (
    <div className="mt-14">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('service')}
          className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
            activeTab === 'service'
              ? 'bg-[#111] text-white'
              : 'bg-[#f4f4f4] text-[#575757] hover:bg-[#e8e8e8]'
          }`}
        >
          Service Card
        </button>
        <button
          onClick={() => setActiveTab('car')}
          className={`rounded-full px-5 py-2.5 text-[13px] font-medium transition-colors ${
            activeTab === 'car'
              ? 'bg-[#111] text-white'
              : 'bg-[#f4f4f4] text-[#575757] hover:bg-[#e8e8e8]'
          }`}
        >
          Car Card
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/[0.05]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeTab === 'service' ? '/Images/services.png' : '/Images/car services.png'}
          alt={activeTab === 'service' ? 'Service card edge cases' : 'Car card edge cases'}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
