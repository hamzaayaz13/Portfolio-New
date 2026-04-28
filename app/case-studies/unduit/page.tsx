'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, GripVertical, CheckCircle } from 'lucide-react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

// Smooth scroll fade-in animation
const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.7, 
      ease: [0.25, 0.1, 0.25, 1] 
    } 
  }
};

// Stagger children animation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const fadeInItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
  }
};

// Compare slider
const Compare = ({ firstImage, secondImage }: { firstImage: string; secondImage: string }) => {
  const [percent, setPercent] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPercent(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-full cursor-col-resize select-none"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={(e) => dragging && handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <Image src={secondImage} alt="Redesigned interface" fill className="object-cover" draggable={false} />
      <div className="absolute inset-0 z-10 overflow-hidden" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
        <Image src={firstImage} alt="Original interface" fill className="object-cover" draggable={false} />
      </div>
      {/* Slider line */}
      <div className="absolute inset-y-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]" style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}>
        {/* Slider handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] flex items-center justify-center border-4 border-[var(--accent)]">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4 text-[var(--accent)]" />
            <ChevronRight className="w-4 h-4 text-[var(--accent)]" />
          </div>
        </div>
      </div>
      {/* Hint text */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-black/60 rounded-full text-white text-[13px] font-medium backdrop-blur-sm">
        Drag to compare
      </div>
    </div>
  );
};

// Design comparison data - Old vs New with explanations
const DESIGN_COMPARISONS = [
  {
    id: 1,
    title: 'Wallet Selection Redesign',
    subtitle: 'From dropdown friction to one-tap selection',
    oldImage: '/Images/Refresh Buy Step-1.png',
    newImage: '/Images/Dashboard (1).png',
    differences: [
      'Removed the comparison panel that added unnecessary visual noise to the interface',
      'Replaced dropdown wallet selector with visible card-based selection — users typically have 1-5 wallets, making a dropdown unnecessarily cumbersome',
      'Added "Add New Wallet" option directly in the flow — previously users had to navigate away to the wallet page, create a wallet, and return',
      'The steps component replaced the comparison table in the same visual area to match existing user scanning behavior and make the new guided flow feel natural for both existing and new users.',
      'Reduced visual load by removing redundant copy that cluttered the page',
    ],
  },
  {
    id: 2,
    title: 'Multi-Select Simplification',
    subtitle: 'Eliminating unnecessary clicks',
    oldImage: '/Images/Refresh Buy Step-4.png',
    newImage: '/Images/Dashboard-2.png',
    differences: [
      'Original design buried options inside a dropdown with two choices and an "Add more" button for multi-select',
      'Each additional selection required: open dropdown → select option → click "Add more" → repeat',
      'Redesigned as visible cards that support multi-select directly — users can see all options at once and select multiple with single taps',
      'Reduced clicks from 4+ per selection to just 1, significantly improving the configuration speed',
    ],
  },
];

const SCREENS = [
  { title: 'Getting started', caption: 'A welcoming intro that sets expectations before users dive in.', src: '/Images/1st Page.png', alt: 'Welcome screen with onboarding video' },
  { title: 'Campaign overview', caption: 'Everything at a glance — progress, actions, and next steps.', src: '/Images/Dashboard (1).png', alt: 'Campaign setup dashboard with progress indicators' },
  { title: 'Shipping setup', caption: 'Where devices go when employees return them.', src: '/Images/Dashboard.png', alt: 'Return address configuration screen' },
  { title: 'Step-by-step flow', caption: 'Guided sequence ensures nothing important gets skipped.', src: '/Images/Dashboard-1.png', alt: 'Step-by-step configuration checklist' },
  { title: 'Custom fields', caption: 'Capture exactly the data you need — nothing more, nothing less.', src: '/Images/Dashboard-2.png', alt: 'Form builder with drag and drop fields' },
  { title: 'Employee actions', caption: 'Define what happens next — keep, recycle, or return.', src: '/Images/Dashboard-3.png', alt: 'Employee action options configuration' },
  { title: 'Device types', caption: 'Laptops, phones, tablets — specify what gets recovered.', src: '/Images/Dashboard-4.png', alt: 'Device type selection screen' },
];

const RESEARCH_INSIGHTS = [
  {
    number: '01',
    title: 'Users Were Guessing Their Way Through',
    description:
      'Step 3 and 4 created the most friction. Users paused, reread labels, and guessed what to do next.',
    image: '/Images/research-insight/users-guessing.png',
    alt: 'Illustration of a confused user looking at custom fields and form controls',
  },
  {
    number: '02',
    title: 'Extra Content Became a Distraction',
    description:
      'The comparison table pulled attention away from setup, adding cognitive load instead of helping decisions.',
    image: '/Images/research-insight/extra-content-distraction.png',
    alt: 'Illustration of a user comparing options in a table',
  },
  {
    number: '03',
    title: 'Too Many Clicks for Simple Actions',
    description:
      'Users kept moving back and forth to recheck choices, creating unnecessary effort and confusion.',
    image: '/Images/research-insight/too-many-clicks.png',
    alt: 'Illustration of a frustrated user with repeated questions and backtracking',
  },
];

export default function UnduitCaseStudy() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [comparisonModal, setComparisonModal] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeComparison = comparisonModal !== null ? DESIGN_COMPARISONS[comparisonModal] : null;

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 400;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      
      {/* HERO — Original dark theme preserved */}
      <div className="bg-black overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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
          <video src="/Animated_Spotlight_on_Laptop.mp4" autoPlay muted loop playsInline preload="metadata" className="mx-auto rounded-2xl object-cover h-full w-full" draggable={false} />
        </ContainerScroll>
      </div>

      {/* SECTION: Context + Role */}
      <section className="py-24 md:py-32">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[900px]">
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8">
              Redesigning the Refresh app to reduce <span className="text-[var(--accent)]">support tickets.</span>
            </h2>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed mb-6">
              The Refresh app helps enterprise IT managers configure device recovery and buy-back campaigns. This case study focuses on redesigning the setup experience to reduce errors, eliminate confusion, and make complex workflows self-explanatory.
            </p>
            <p className="text-[14px] text-[var(--muted-text)]">
              Role: Product & Visual Designer · UX audit, UX writing, UI simplification · Web app
            </p>
          </motion.div>
        </div>
      </section>

      {/* LARGE VISUAL BREAK - Problem Image */}
      <section className="py-12 md:py-20">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Meme Image - Large */}
              <div className="relative aspect-square max-w-[500px] mx-auto md:mx-0 rounded-3xl overflow-hidden">
                <Image 
                  src="/Images/bbc1b891-bc25-47d9-a8e5-5e8c20f6c397-screen-shot-2018-02-22-at-95910-am (1).avif" 
                  alt="Why are you the way that you are meme representing user frustration" 
                  fill 
                  className="object-cover" 
                />
              </div>
              
              {/* Problem Content */}
              <div className="max-w-[480px]">
                <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8">
                  The Problem
                </h2>
                <p className="text-[18px] md:text-[20px] text-[var(--muted-text)] leading-relaxed mb-10">
                  For an IT manager at a Fortune 500 company, time is the most valuable resource. The original Unduit app was costing them hours of frustration.
                </p>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <span className="text-[var(--accent)] font-mono text-xl">/</span>
                    <p className="text-[17px] text-[var(--muted-text)]">Confusing labels that failed to describe the next action.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[var(--accent)] font-mono text-xl">/</span>
                    <p className="text-[17px] text-[var(--muted-text)]">Irrelevant &apos;comparison panels&apos; that added visual noise.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[var(--accent)] font-mono text-xl">/</span>
                    <p className="text-[17px] text-[var(--muted-text)]">Non-linear flows that allowed users to skip critical data points.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RESEARCH & INSIGHT */}
      <section className="py-24 md:py-32">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="w-full mb-14 md:mb-20">
            <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-6">Research & Insight</p>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8">
              Understanding why users struggled during setup.
            </h2>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed mb-6 max-w-none">
              To understand why users struggled during setup, I conducted usability testing sessions with first-time users from the target audience, including IT and HR managers.
            </p>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed mb-6 max-w-none">
              The sessions focused on observing how users navigated the flow independently, where they hesitated, and what created friction during the setup process. Since the company was actively investing in growth and marketing, the onboarding experience needed to feel intuitive and self-guided for completely new users entering the platform.
            </p>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed max-w-none">
              Alongside usability testing, session recordings were analyzed through PostHog to identify repeated patterns, confusion points, and behavioral drop-offs across the flow.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 md:gap-8 mb-14 md:mb-20"
          >
            {RESEARCH_INSIGHTS.map((insight) => (
              <motion.article
                key={insight.number}
                variants={fadeInItem}
                className="min-w-0"
              >
                <div className="relative aspect-[4/3] mb-5 overflow-hidden rounded-2xl bg-[var(--muted-bg)]">
                  <Image src={insight.image} alt={insight.alt} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[13px] text-[var(--accent)] font-mono mb-3">{insight.number} —</p>
                  <h3 className="text-[20px] font-semibold leading-tight mb-4">{insight.title}</h3>
                  <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">{insight.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[900px] border-t border-[var(--subtle)] pt-10 md:pt-12">
            <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-6">Core Insight</p>
            <h3 className="text-[28px] md:text-[36px] font-semibold leading-[1.15] tracking-[-0.02em] mb-6">
              The issue wasn&apos;t complexity — it was lack of direction.
            </h3>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed">
              Users didn&apos;t need more information. They needed a flow that clearly guided them through what mattered, in the right order.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LARGE VISUAL BREAK - Before/After Comparison */}
      <section className="py-20 md:py-28 bg-[var(--muted-bg)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
          <div className="container-main mb-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-6">Transformation</p>
                <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-4">
                  See the difference.
                </h2>
                <p className="text-[18px] text-[var(--muted-text)] max-w-[600px]">
                  Drag the slider to compare the original interface with the redesigned version.
                </p>
              </div>
              <div className="flex justify-center md:min-w-[280px]">
                <button
                  onClick={() => setComparisonModal(0)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 bg-[var(--text)] text-white rounded-full text-[15px] font-medium hover:bg-[var(--accent)] transition-colors"
                >
                  <span>Compare Before & After</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
          <div className="px-4 md:px-8">
            <figure className="max-w-[1200px] mx-auto">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl bg-white">
                <div className="absolute top-6 left-6 z-30 px-5 py-2.5 bg-white rounded-full text-[13px] font-semibold text-[var(--muted-text)] shadow-lg">Before</div>
                <div className="absolute top-6 right-6 z-30 px-5 py-2.5 bg-[var(--accent)] rounded-full text-[13px] font-semibold text-white shadow-lg">After</div>
                <Compare firstImage="/Images/Refresh Buy Step-1.png" secondImage="/Images/Dashboard (1).png" />
              </div>
            </figure>
          </div>
        </motion.div>
      </section>

      {/* STRATEGY - Three principles */}
      <section className="py-24 md:py-32">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="max-w-[800px] mb-16">
              <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-6">Strategy</p>
              <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
                Three principles.
              </h2>
            </div>
            
            {/* Apple-style cards with animated icons */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1: Guided Linear Flow — vertical stepper */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)] group"
              >
                <motion.div 
                  className="relative w-14 h-14 mb-6 rounded-2xl border border-[var(--subtle)] bg-[var(--muted-bg)] text-[var(--accent)] flex items-center justify-center overflow-hidden"
                  initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.15 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    {/* Vertical track connecting all steps */}
                    <motion.path
                      d="M9 7 L9 17"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, delay: 0.35, ease: "easeOut" }}
                    />
                    {/* Step node 1 */}
                    <motion.circle cx="9" cy="5" r="2.1"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.22 }}
                    />
                    {/* Step node 2 */}
                    <motion.circle cx="9" cy="12" r="2.1"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.58 }}
                    />
                    {/* Step node 3 */}
                    <motion.circle cx="9" cy="19" r="2.1"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 420, damping: 14, delay: 0.88 }}
                    />
                    {/* Label lines — longest → shortest (priority order) */}
                    <motion.path d="M12.5 5 L20 5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.55 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.32, delay: 0.42 }}
                    />
                    <motion.path d="M12.5 12 L17.5 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.55 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.28, delay: 0.72 }}
                    />
                    <motion.path d="M12.5 19 L15 19"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.55 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.22, delay: 1.0 }}
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[20px] font-semibold mb-3">Guided linear flow</h3>
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">
                  Steps structured in sequence. Critical configuration cannot be skipped.
                </p>
              </motion.div>

              {/* Card 2: UX Writing — speech bubble with purposeful text lines */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)] group"
              >
                <motion.div 
                  className="relative w-14 h-14 mb-6 rounded-2xl border border-[var(--subtle)] bg-[var(--muted-bg)] text-[var(--accent)] flex items-center justify-center overflow-hidden"
                  initial={{ opacity: 0, scale: 0.85, rotate: 6 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.25 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    {/* Speech bubble outline — rounded rect with bottom-left pointer */}
                    <motion.path
                      d="M5 2.5 H19 Q21.5 2.5 21.5 5 V13 Q21.5 15.5 19 15.5 H12.5 L9.5 18.5 L9.5 15.5 H5 Q2.5 15.5 2.5 13 V5 Q2.5 2.5 5 2.5 Z"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.05, delay: 0.25, ease: "easeOut" }}
                    />
                    {/* Full-width text line — the "intent" copy */}
                    <motion.path d="M6 7 L18 7"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.55 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.88 }}
                    />
                    {/* Shorter text line — "consequence" copy, not just a label */}
                    <motion.path d="M6 10.5 L13.5 10.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.55 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.38, delay: 1.1 }}
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[20px] font-semibold mb-3">UX writing</h3>
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">
                  Microcopy explains intent and consequences, not just labels.
                </p>
              </motion.div>

              {/* Card 3: Simplification — crop-frame brackets focusing on the essential */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)] group"
              >
                <motion.div 
                  className="relative w-14 h-14 mb-6 rounded-2xl border border-[var(--subtle)] bg-[var(--muted-bg)] text-[var(--accent)] flex items-center justify-center overflow-hidden"
                  initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -3, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.35 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                    {/* Corner crop brackets — the "framing" of what matters */}
                    <motion.path d="M3 8 V3 H8"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.42, delay: 0.28 }}
                    />
                    <motion.path d="M16 3 H21 V8"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.42, delay: 0.38 }}
                    />
                    <motion.path d="M21 16 V21 H16"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.42, delay: 0.48 }}
                    />
                    <motion.path d="M8 21 H3 V16"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.42, delay: 0.58 }}
                    />
                    {/* Inner focused element — the singular decision that matters */}
                    <motion.rect x="8.5" y="8.5" width="7" height="7" rx="1.5"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.82 }}
                    />
                  </svg>
                </motion.div>
                <h3 className="text-[20px] font-semibold mb-3">Simplification</h3>
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">
                  Visual noise removed. Focus on decisions that matter.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SCREENS CAROUSEL - Full width visual break */}
      <section className="py-12 md:py-20 overflow-hidden">
        <div className="container-main mb-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-4">Final screens</p>
                <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
                  The new setup journey.
                </h2>
              </div>
              <div className="hidden md:flex gap-2">
                <button onClick={() => scrollCarousel("left")} className="p-3 rounded-full border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors" aria-label="Scroll left">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => scrollCarousel("right")} className="p-3 rounded-full border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors" aria-label="Scroll right">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Horizontal scroll carousel */}
        <div ref={carouselRef} className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div className="flex gap-6 px-[max(24px,calc((100vw-var(--container-max))/2+24px))]">
            {SCREENS.map((screen, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-shrink-0 w-[85vw] md:w-[700px] cursor-pointer group"
                onClick={() => { setActiveScreen(i); setModalOpen(true); }}
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[var(--muted-bg)] shadow-lg group-hover:shadow-xl transition-shadow">
                  <Image src={screen.src} alt={screen.alt} fill className="object-cover" />
                </div>
                <div className="mt-6">
                  <h3 className="text-[20px] font-semibold mb-1">{screen.title}</h3>
                  <p className="text-[16px] text-[var(--muted-text)]">{screen.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGN EVOLUTION - Side by side layout */}
      <section className="py-24 md:py-32">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="max-w-[800px] mb-20">
              <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-6">Design Decisions</p>
              <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
                Every change had a reason.
              </h2>
            </div>
          </motion.div>
          
          {/* Two-column cards */}
          <div className="space-y-16 md:space-y-24">
            {DESIGN_COMPARISONS.map((design, index) => (
              <motion.div
                key={design.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
              >
                {/* Left - Image */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[var(--muted-bg)] shadow-xl">
                  <Image 
                    src={design.newImage} 
                    alt={design.title} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                
                {/* Right - Content */}
                <div className="py-4">
                  <p className="text-[20px] md:text-[24px] text-[var(--text)] font-medium leading-relaxed mb-6">{design.subtitle}</p>
                  
                  {/* Brief bullet points - only 2 */}
                  <ul className="space-y-3 mb-8">
                    {design.differences.slice(0, 2).map((diff, i) => (
                      <li key={i} className="flex gap-3 text-[15px] text-[var(--muted-text)]">
                        <span className="text-[var(--accent)] mt-1">•</span>
                        <span className="line-clamp-2">{diff}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => setComparisonModal(index)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text)] text-white rounded-full text-[15px] font-medium hover:bg-[var(--accent)] transition-colors"
                  >
                    <span>Compare Before & After</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON MODAL */}
      <AnimatePresence>
        {comparisonModal !== null && activeComparison && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setComparisonModal(null)} 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl"
            >
              <button 
                onClick={() => setComparisonModal(null)} 
                className="absolute right-6 top-6 z-10 p-3 rounded-full bg-[var(--muted-bg)] hover:bg-gray-200 transition-colors" 
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8 md:p-12">
                <div className="mb-10">
                  <h3 className="text-[28px] md:text-[36px] font-semibold mb-3">{activeComparison.title}</h3>
                  <p className="text-[18px] text-[var(--muted-text)]">{activeComparison.subtitle}</p>
                </div>
                
                {/* Side by side comparison */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-[13px] uppercase tracking-wider text-[var(--muted-text)] mb-4">Before</p>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                      <Image src={activeComparison.oldImage} alt="Original design" fill className="object-cover" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] uppercase tracking-wider text-[var(--accent)] mb-4">After</p>
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 border-2 border-[var(--accent)]">
                      <Image src={activeComparison.newImage} alt="Redesigned" fill className="object-cover" />
                    </div>
                  </div>
                </div>
                
                {/* Key differences */}
                <div className="bg-[var(--muted-bg)] rounded-2xl p-8 md:p-10">
                  <h4 className="text-[20px] font-semibold mb-6">Key Improvements</h4>
                  <ul className="space-y-4">
                    {activeComparison.differences.map((diff, i) => (
                      <li key={i} className="flex gap-4 text-[16px] text-[var(--muted-text)]">
                        <CheckCircle className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between items-center mt-10 pt-8 border-t border-[var(--subtle)]">
                  <button 
                    onClick={() => setComparisonModal(prev => prev !== null ? (prev - 1 + DESIGN_COMPARISONS.length) % DESIGN_COMPARISONS.length : 0)}
                    className="flex items-center gap-2 text-[15px] text-[var(--muted-text)] hover:text-[var(--text)] transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                  <span className="text-[14px] text-[var(--muted-text)]">
                    {(comparisonModal ?? 0) + 1} of {DESIGN_COMPARISONS.length}
                  </span>
                  <button 
                    onClick={() => setComparisonModal(prev => prev !== null ? (prev + 1) % DESIGN_COMPARISONS.length : 0)}
                    className="flex items-center gap-2 text-[15px] text-[var(--muted-text)] hover:text-[var(--text)] transition-colors"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL - Screen detail */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden">
              <button onClick={() => setModalOpen(false)} className="absolute right-6 top-6 z-10 p-3 rounded-full bg-[var(--muted-bg)] hover:bg-[var(--subtle)]" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-video bg-[var(--muted-bg)]">
                <Image src={SCREENS[activeScreen].src} alt={SCREENS[activeScreen].alt} fill className="object-contain p-4" />
              </div>
              <div className="p-8 md:p-10 text-center">
                <h3 className="text-[24px] font-semibold mb-3">{SCREENS[activeScreen].title}</h3>
                <p className="text-[17px] text-[var(--muted-text)]">{SCREENS[activeScreen].caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OUTCOME - Apple-style cards */}
      <section className="py-24 md:py-32 bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
              The redesigned flow delivered <span className="text-[var(--accent)]">measurable results.</span>
            </h2>
          </motion.div>

          {/* Apple-style outcome cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)]"
            >
              <div className="w-10 h-10 mb-6 text-[var(--accent)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[18px] font-semibold leading-relaxed">
                Setup completed <span className="text-[var(--accent)]">~30% faster</span> on average.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)]"
            >
              <div className="w-10 h-10 mb-6 text-orange-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[18px] font-semibold leading-relaxed">
                Configuration errors reduced by <span className="text-orange-500">~45%</span>.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)]"
            >
              <div className="w-10 h-10 mb-6 text-cyan-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-[18px] font-semibold leading-relaxed">
                Noticeable decrease in <span className="text-cyan-500">support tickets</span> post-launch.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REFLECTION */}
      <section className="py-24 md:py-32 bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[800px]">
            <p className="text-[14px] text-[var(--accent)] uppercase tracking-wider mb-6">Reflection</p>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8">
              For enterprise tools, clarity is a feature.
            </h2>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed mb-10">
              This redesign shows how guided UX, strong writing, and restraint can directly reduce operational load.
            </p>
            <Link href="/contact" className="inline-block px-8 py-4 bg-[var(--text)] text-white rounded-full text-[16px] font-medium hover:bg-black transition-colors">
              Contact me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NAV */}
      <nav className="py-8 border-t border-[var(--subtle)]">
        <div className="container-main flex justify-between items-center">
          <Link href="/" className="text-[15px] text-[var(--accent)] hover:underline">← Home</Link>
          <Link href="/case-studies/mobile-nav" className="text-[15px] text-[var(--accent)] hover:underline">Next Case Study →</Link>
        </div>
      </nav>
    </div>
  );
}
