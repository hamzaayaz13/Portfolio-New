'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, Construction } from 'lucide-react';

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

const SCREENS = [
  { title: 'Service selection', caption: 'Clear categories reduce decision fatigue.', src: '/Images/carforce/mobile 1.png', alt: 'Service category selection screen', bg: '#e8f4fc' },
  { title: 'Payment clarity', caption: 'Transparent pricing at checkout.', src: '/Images/carforce/mobile 2.png', alt: 'Payment screen with itemized pricing', bg: '#f0f8e8' },
  { title: 'Request tracking', caption: 'Manage multiple bookings confidently.', src: '/Images/carforce/mobile 3.png', alt: 'Active requests list with status', bg: '#fef4e8' },
  { title: 'Booking details', caption: 'All information at a glance.', src: '/Images/carforce/mobile 4.png', alt: 'Booking summary screen', bg: '#f4e8fc' },
];

export default function CarForceCaseStudy() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show toast after a short delay
    const timer = setTimeout(() => setShowToast(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const openModal = (index: number) => {
    setActiveModal(index);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      
      {/* Under Construction Modal */}
      <AnimatePresence>
        {showToast && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            {/* Blurred backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowToast(false)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-md" 
            />
            
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-[420px] w-full overflow-hidden"
            >
              {/* Progress bar at top */}
              <div className="h-1.5 bg-gray-100">
                <div className="h-full w-[75%] bg-gradient-to-r from-amber-400 to-amber-500" />
              </div>
              
              <div className="p-8 text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <Construction className="w-8 h-8 text-amber-600" />
                </div>
                
                {/* Title */}
                <h3 className="text-[22px] font-semibold text-[var(--text)] mb-2">
                  Work in progress
                </h3>
                
                {/* Progress indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full mb-4">
                  <span className="text-[13px] font-semibold text-amber-600">75% complete</span>
                </div>
                
                {/* Description */}
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed mb-6">
                  This case study is still being polished. The designer in me won&apos;t let it go until it&apos;s perfect.
                </p>
                
                {/* Button */}
                <button 
                  onClick={() => setShowToast(false)}
                  className="px-6 py-3 bg-[var(--text)] text-white rounded-full text-[15px] font-medium hover:bg-black transition-colors"
                >
                  Continue anyway →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="pt-[var(--space-xxl)] pb-[var(--space-xl)]">
        <div className="container-main">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-[720px] mb-[var(--space-xl)]">
            <small className="label block mb-3">Case Study</small>
            <h1 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-4">
              Dubizzle — <span className="text-[var(--accent)]">CarForce</span>
            </h1>
            <p className="text-[17px] md:text-[19px] text-[var(--muted-text)] leading-relaxed">
              Redesigning service booking for automotive partners in Dubai.
            </p>
          </motion.div>
        </div>
        {/* Hero Image - Full width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full px-4 md:px-8"
        >
          <div className="max-w-[1400px] mx-auto">
            <Image 
              src="/Images/carforce/hero-carforce.png" 
              alt="CarForce app screens showing payment details, car information, request stages, and booking management"
              width={1400}
              height={700}
              className="w-full h-auto"
              priority
              unoptimized
            />
          </div>
        </motion.div>
      </section>

      {/* SECTION: Context */}
      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[900px]">
            <small className="label block mb-3">Context</small>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-6">
              Who uses CarForce.
            </h2>
            <p className="text-[17px] md:text-[19px] text-[var(--muted-text)] leading-relaxed mb-4">
              Automotive partners — car vendors and bank representatives — book evaluations, insurance, and financing on behalf of customers.
            </p>
            <p className="text-[14px] text-[var(--muted-text)]">
              Role: Product Designer · 3-week sprint · Mobile app
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION: Problem */}
      <section className="section-gap">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="max-w-[520px]">
                <small className="label block mb-3">Problem</small>
                <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-6">
                  Experience broke at <span className="text-[var(--accent)]">critical moments.</span>
                </h2>
                <p className="text-[17px] md:text-[19px] text-[var(--muted-text)] leading-relaxed mb-4">
                  Inconsistent patterns, unclear actions, and uncertain payment flows. Simple tasks required too much thinking.
                </p>
                <p className="text-[17px] text-[var(--muted-text)] leading-relaxed">
                  Payments were the primary revenue moment — friction here impacted business directly.
                </p>
              </div>
              <figure>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden visual-shadow">
                  <Image src="/Images/carforce/problem.png" alt="Original CarForce showing inconsistent interface" fill className="object-cover" />
                </div>
              </figure>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION: Insight */}
      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[900px]">
            <small className="label block mb-3">Insight</small>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-6">
              Trust breaks when payments are confusing.
            </h2>
            <p className="text-[17px] md:text-[19px] text-[var(--muted-text)] leading-relaxed">
              Partners needed to complete requests quickly. Visual inconsistency created hesitation at the moment momentum mattered most.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION: Strategy - Apple-style cards */}
      <section className="section-gap">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="max-w-[800px] mb-16">
              <small className="label block mb-3">Strategy</small>
              <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
                Three principles.
              </h2>
            </div>
            
            {/* Apple-style cards with icons */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)]">
                <div className="w-12 h-12 mb-6 text-[var(--muted-text)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-semibold mb-3">Hierarchy</h3>
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">
                  Whitespace over density. Let the interface breathe. Every element earns its place.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)]">
                <div className="w-12 h-12 mb-6 text-[var(--muted-text)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                    <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-semibold mb-3">Consistency</h3>
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">
                  One system across all services and flows.
                </p>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--subtle)]">
                <div className="w-12 h-12 mb-6 text-[var(--muted-text)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-[20px] font-semibold mb-3">Trust</h3>
                <p className="text-[15px] text-[var(--muted-text)] leading-relaxed">
                  Payments as reassurance moments, not anxiety.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION: Flow */}
      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[900px]">
            <small className="label block mb-3">Core flow</small>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-6">
              The booking journey.
            </h2>
            <p className="text-[17px] md:text-[19px] text-[var(--muted-text)] leading-relaxed">
              Select service → Submit details → Pay now or later → Track request
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION: Screens - Horizontal Phone Carousel */}
      <section className="section-gap">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <small className="label block mb-3">Final screens</small>
                <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
                  Take a closer <span className="text-[var(--accent)]">look.</span>
                </h2>
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

        {/* Phone Carousel - Full width */}
        <div ref={carouselRef} className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-5 px-[max(24px,calc((100vw-var(--container-max))/2+24px))]">
            {SCREENS.map((screen, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex-shrink-0 w-[260px] cursor-pointer group"
                onClick={() => openModal(i)}
              >
                <div 
                  className="rounded-3xl p-6 pb-4 transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundColor: screen.bg }}
                >
                  <div className="relative w-[200px] mx-auto aspect-[9/19] rounded-[32px] overflow-hidden shadow-xl">
                    <Image src={screen.src} alt={screen.alt} fill className="object-cover" />
                  </div>
                </div>
                <p className="mt-4 text-center text-[15px] px-2">
                  <span className="font-semibold text-[var(--text)]">{screen.title}.</span>{' '}
                  <span className="text-[var(--muted-text)]">{screen.caption}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-2xl overflow-hidden p-8 max-w-md">
              <button onClick={() => setModalOpen(false)} className="absolute right-4 top-4 z-10 p-2 rounded-full bg-[var(--muted-bg)] hover:bg-[var(--subtle)] transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
              <div 
                className="rounded-2xl p-6 mb-4"
                style={{ backgroundColor: SCREENS[activeModal].bg }}
              >
                <div className="relative w-[220px] mx-auto aspect-[9/19] rounded-[32px] overflow-hidden shadow-xl">
                  <Image src={SCREENS[activeModal].src} alt={SCREENS[activeModal].alt} fill className="object-cover" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-[20px] font-semibold mb-2">{SCREENS[activeModal].title}</h3>
                <p className="text-[16px] text-[var(--muted-text)]">{SCREENS[activeModal].caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION: Overview */}
      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn}>
            <small className="label block mb-3">Overview</small>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-10">
              The complete design.
            </h2>
            <figure>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden visual-shadow">
                <Image src="/Images/carforce/all screens.png" alt="Complete CarForce app screens overview" fill className="object-cover" />
              </div>
            </figure>
          </motion.div>
        </div>
      </section>

      {/* SECTION: Outcome - Apple-style cards */}
      <section className="section-gap">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em]">
              The redesign delivered <span className="text-[var(--accent)]">real results.</span>
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
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[18px] font-semibold leading-relaxed">
                Full <span className="text-[var(--accent)]">stakeholder approval</span> on first review.
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
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-[18px] font-semibold leading-relaxed">
                <span className="text-orange-500">Cohesive foundation</span> for future iterations.
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
                  <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[18px] font-semibold leading-relaxed">
                <span className="text-cyan-500">Positive partner feedback</span> post-launch.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: Reflection */}
      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-[900px]">
            <small className="label block mb-3">Reflection</small>
            <h2 className="text-[32px] md:text-[42px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] mb-8">
              Clarity builds trust.
            </h2>
            <p className="text-[18px] md:text-[21px] text-[var(--muted-text)] leading-relaxed mb-10">
              Focused UX and visual consistency directly impact revenue moments.
            </p>
            <Link href="/contact" className="inline-block px-8 py-4 bg-[var(--text)] text-white rounded-full text-[16px] font-medium hover:bg-black transition-colors">
              Contact me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NAV */}
      <nav className="py-6 border-t border-[var(--subtle)]">
        <div className="container-main flex justify-between items-center">
          <Link href="/" className="text-[15px] text-[var(--accent)] hover:underline">← Home</Link>
          <Link href="/case-studies/unduit" className="text-[15px] text-[var(--accent)] hover:underline">Next Case Study →</Link>
        </div>
      </nav>
    </div>
  );
}
