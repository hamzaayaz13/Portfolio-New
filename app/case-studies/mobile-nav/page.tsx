'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CaseStudyBottomNav } from '@/components/ui/case-study-bottom-nav';

export default function MobileNavCaseStudy() {
  useEffect(() => {
    // Add responsive styles for hero
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 980px) {
        .hero-inner {
          grid-template-columns: 1fr !important;
          padding-left: 20px !important;
          padding-right: 20px !important;
          gap: 28px !important;
        }
        .panel-shell {
          position: static !important;
          height: auto !important;
          min-height: 420px !important;
        }
        .panel {
          padding: 16px !important;
        }
        .hero-inner {
          padding-right: 20px !important;
        }
        .device-wrap {
          width: min(360px, 88%) !important;
          aspect-ratio: 9/19 !important;
          margin: 0 auto !important;
        }
        .panel-caption {
          text-align: center !important;
          position: relative !important;
          bottom: auto !important;
          right: auto !important;
          margin-top: 12px !important;
        }
        .device-wrap img {
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0b0f12', color: '#ffffff' }}>
      {/* Hero Section - Editorial left + filled right panel */}
      <section 
        className="hero-wrap"
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 120px)',
          overflow: 'hidden',
          padding: '0',
          paddingTop: '120px',
          marginTop: '0',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-label="Project hero area"
      >
        <div 
          className="hero-inner"
          style={{
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(40px, 6vw, 100px)',
            alignItems: 'center',
            paddingLeft: 'clamp(32px, 8vw, 120px)',
            paddingRight: '0',
            boxSizing: 'border-box',
          }}
        >
          {/* LEFT: Editorial copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hero-copy"
            style={{
              paddingTop: '40px',
              paddingBottom: '40px',
              zIndex: 3,
            }}
            aria-labelledby="hero-title"
          >
                        <h1 
                          id="hero-title"
                          style={{
                            margin: '0',
                            fontSize: 'clamp(28px, 5vw, 48px)',
                            lineHeight: '1.05',
                            letterSpacing: '-0.02em',
                            maxWidth: '640px',
                            color: '#ffffff',
                          }}
                        >
              <span style={{ fontWeight: '500' }}>Redesigning Dubizzle&apos;s Affiliate App for a </span>
              <span style={{ fontWeight: '800' }}>Faster, Clearer, Frictionless Experience</span>
            </h1>

            <p 
              className="lead"
              style={{
                margin: '32px 0 0 0',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 'clamp(16px, 1.4vw, 19px)',
                maxWidth: '520px',
                lineHeight: '1.6',
              }}
            >
              A 3-week cross-functional redesign to fix UX and UI issues, clarify payments, reduce form friction, and deliver a clean, minimal, conversion-ready experience.
            </p>

            <div 
              className="meta"
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '24px',
              }}
              aria-hidden="true"
            >
              <span 
                className="pill"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                Product Designer
              </span>
              <span 
                className="pill"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                3 weeks
              </span>
            </div>

            <div 
              className="cta"
              style={{
                marginTop: '64px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
              role="toolbar"
              aria-label="Primary actions"
            >
              <a 
                href="#final-designs"
                className="btn"
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  background: '#7c5cff',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                See final designs
              </a>
              <a 
                href="#research"
                className="btn secondary"
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '16px',
                }}
              >
                Read research
              </a>
            </div>
          </motion.div>

          {/* RIGHT: Full-bleed video panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="panel-shell"
            style={{
              position: 'absolute',
              left: '52%',
              right: '0',
              top: '40px',
              bottom: '40px',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              pointerEvents: 'none',
              zIndex: 1,
            }}
            aria-hidden="true"
          >
            <div 
              className="panel"
              style={{
                width: '100%',
                maxWidth: 'none',
                height: '100%',
                padding: '0',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div 
                className="panel-inner"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '32px 0 0 32px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRight: 'none',
                  background: '#161b22',
                  boxShadow: '0 80px 160px rgba(0,0,0,0.5)',
                  position: 'relative',
                }}
                role="img"
                aria-label="Primary visual panel with video"
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                  style={{
                    zIndex: 1,
                  }}
                >
                  <source src="/1102.mp4" type="video/mp4" />
                </video>

                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to right, rgba(11,15,18,0.4), transparent)',
                    zIndex: 2,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-64 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left: Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Project Overview</span>
              <h2 className="mb-12 font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                Context
              </h2>
              <div className="space-y-8">
                <p className="leading-relaxed" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                  Dubizzle&apos;s Affiliate App enables automotive partners in Dubai—such as car vendors and bank representatives—to book essential services like bank evaluation, insurance, and financing on behalf of customers.
                </p>
                <p className="leading-relaxed" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8' }}>
                  The app was still in development and had not yet launched. Early stakeholder testing revealed significant usability and clarity issues across nearly every core screen. Since revenue depended heavily on users completing service selection and payments, the experience needed to be fast, intuitive, and trustworthy.
                </p>
              </div>
              
              <div className="mt-16 grid grid-cols-2 gap-y-10 gap-x-12 pt-16 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {[
                  { label: "Role", val: "Product Designer" },
                  { label: "Timeline", val: "3 weeks" },
                  { label: "Team", val: "PM, Exec, 2 Eng" },
                  { label: "Market", val: "Dubai / UAE" }
                ].map((item, i) => (
                  <div key={i}>
                    <h4 className="text-[12px] uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</h4>
                    <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{item.val}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Image container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl group"
            >
              <Image
                src="/Images/carforce/context.png"
                alt="Context image showing product overview"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-64 px-6 md:px-12 bg-white/[0.01] border-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 order-2 lg:order-1 shadow-2xl group"
            >
              <Image
                src="/Images/carforce/problem.png"
                alt="Problem visualization showing user pain points"
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-black/40 to-transparent pointer-events-none" />
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2"
            >
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Identifying Friction</span>
              <h2 className="mb-12 font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                Problem
              </h2>
              <div className="space-y-8 mb-20">
                <p className="leading-relaxed" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                  The existing Affiliate App suffered from inconsistent UI, confusing flows, and poor hierarchy, making even basic tasks unnecessarily difficult.
                </p>
                <p className="leading-relaxed" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.8' }}>
                  Each screen introduced different usability issues—cluttered layouts, unclear actions, inconsistent patterns, and confusing payment breakdowns.
                </p>
              </div>
              
              <div className="pl-10 border-l-4" style={{ borderColor: '#7c5cff' }}>
                <p className="text-2xl md:text-4xl font-bold tracking-tight leading-tight italic" style={{ color: '#ffffff' }}>
                  If users couldn&apos;t confidently complete a request and pay, the product failed.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Was At Risk Section */}
      <section className="py-64 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-24">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Strategic Impact</span>
              <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                What Was At Risk
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "A broken payment experience at the most critical revenue moment",
                "High friction during form completion",
                "No clear sense of request progress or status",
                "Reduced trust due to visual inconsistency and noise"
              ].map((item, i) => (
                <div key={i} className="p-12 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-all duration-500 group">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs mb-8 group-hover:scale-110 transition-transform">
                    0{i + 1}
                  </div>
                  <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontWeight: '500' }}>{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research & Insights Section */}
      <section id="research" className="pt-64 pb-32 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
              <div className="max-w-2xl">
                <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Evidence-Based Design</span>
                <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                  Research & Inputs
                </h2>
              </div>
              <p className="max-w-md" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: '1.7' }}>
                Since the product was pre-launch, we leveraged stakeholder expertise, early partner testing, and heuristic evaluations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-32">
              <div className="p-12 rounded-[32px] bg-white/[0.02] border border-white/5">
                <h3 className="text-[12px] uppercase tracking-[0.2em] font-bold mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Redesign Context</h3>
                <p className="leading-relaxed" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                   Stakeholder interviews, feedback from early partner testing, concerns raised by sales and operations teams.
                </p>
              </div>
              <div className="p-12 rounded-[32px] bg-white/[0.02] border border-white/5">
                <h3 className="text-[12px] uppercase tracking-[0.2em] font-bold mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>Pattern Analysis</h3>
                <p className="leading-relaxed" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.8' }}>
                  UI pattern research using Mobbin, analyzing best-in-class fintech and automotive SaaS platforms.
                </p>
              </div>
            </div>

            <div className="py-32 border-y mb-32 relative" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 bg-[#0b0f12]">
                <div className="w-2 h-2 rounded-full bg-[#7c5cff]" />
              </div>
              <p className="text-4xl md:text-6xl font-bold text-center tracking-tight" style={{ color: '#ffffff', lineHeight: '1.1' }}>
                The goal was not to add features—but to <span style={{ color: '#7c5cff' }}>remove friction.</span>
              </p>
            </div>

            <div>
              <h3 className="mb-12 font-bold tracking-tight" style={{ fontSize: '28px', color: '#ffffff' }}>Key Insights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Users were spending too much time on forms due to poor structure and hierarchy.",
                  "Payment screens were confusing when credits were applied.",
                  "Users struggled to understand the request submission status.",
                  "UI inconsistency increased cognitive load and reduced confidence."
                ].map((insight, i) => (
                  <div key={i} className="flex gap-8 items-start p-10 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Goal Section */}
      <section className="py-64 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-8 block">The Thesis</span>
            <h2 className="mb-12 font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#ffffff', lineHeight: '1.1' }}>
              Design Goal
            </h2>
            <p className="mb-12 text-2xl md:text-3xl font-medium tracking-tight" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.4' }}>
              Create a service booking experience that feels fast, predictable, and confidence-inspiring—especially at the moment of payment.
            </p>
            <p className="mx-auto max-w-2xl text-lg md:text-xl" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
              Focusing on reduced cognitive load, clarified pricing, and a reinforced visual hierarchy across all critical flows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Flows Redesigned Section */}
      <section id="flows" className="py-64 px-6 md:px-12 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-32">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Execution</span>
              <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                Core Flows Redesigned
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-x-32 gap-y-48 mb-32">
              {[
                {
                  title: "Home / Main Screen",
                  desc: "Acts as a central hub showing all active and pending requests, giving users immediate visibility into status and next actions."
                },
                {
                  title: "Service Selection & Form Flow",
                  desc: "Forms were simplified, broken into clearer sections, and redesigned to collect only essential information upfront.",
                  callout: "Help users move forward without having to think."
                },
                {
                  title: "Payment Flow",
                  desc: "Payment breakdowns were clarified, credit usage was made explicit, and ambiguity around final charges was removed."
                },
                {
                  title: "Request List & Request Detail",
                  desc: "All requests are accessible from the home screen. Each request clearly shows status, payment state, and available actions—allowing users to pay immediately or later without losing context."
                }
              ].map((flow, i) => (
                <div key={i} className="space-y-10 group">
                  <div className="space-y-6">
                    <span className="text-[12px] font-mono text-white/20">0{i + 1}</span>
                    <h3 className="text-2xl font-bold tracking-tight" style={{ color: '#ffffff' }}>{flow.title}</h3>
                    <p className="leading-relaxed" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                      {flow.desc}
                    </p>
                  </div>
                  {flow.callout && (
                    <div className="pt-4">
                      <p className="text-xl font-medium italic border-l-4 pl-8 group-hover:translate-x-2 transition-transform duration-500" style={{ color: '#7c5cff', borderColor: '#7c5cff' }}>
                        &quot;{flow.callout}&quot;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile screenshots grid moved here */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num}
                  className="relative aspect-[9/19] rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 shadow-xl group"
                >
                  <Image
                    src={`/Images/carforce/mobile ${num}.png`}
                    alt={`Mobile screen ${num} showing the reduced-step flow`}
                    fill
                    className="object-cover opacity-95 group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              ))}
            </div>

            {/* Component grid moved here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num}
                  className="relative aspect-square rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 shadow-lg group"
                >
                  <Image
                    src={`/Images/carforce/component ${num}.png`}
                    alt={`Final design component ${num}`}
                    fill
                    className="object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>

            <p className="text-center mb-32 font-medium italic" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>
              Redesigned mobile flows and UI components optimized for high-velocity partner environments.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mental Model Section */}
      <section className="py-64 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-20">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">User Logic</span>
              <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                Mental Model
              </h2>
            </div>
            <div className="p-10 md:p-20 rounded-[48px] bg-white/[0.02] border border-white/5 text-center mb-12 shadow-inner overflow-x-auto">
              <div className="flex items-center justify-center min-w-max md:min-w-0">
                {["Select Service", "Submit Details", "Pay Now/Later", "Track Request"].map((step, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span className="text-xl md:text-3xl font-bold tracking-tight text-white whitespace-nowrap">{step}</span>
                    {idx < arr.length - 1 && <span className="mx-4 md:mx-8 text-[#7c5cff] font-light text-2xl md:text-4xl">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <p className="text-center italic" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>
              This model guided all design decisions throughout the redesign process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Design Decisions Section */}
      <section className="py-64 px-6 md:px-12 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-24 font-bold tracking-tight text-center" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
              Design Decisions
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              {[
                { title: "Hierarchy", desc: "Prioritized hierarchy and whitespace over visual density to reduce choice paralysis." },
                { title: "Disclosure", desc: "Used progressive disclosure to avoid overwhelming users during complex service setups." },
                { title: "Consistency", desc: "Standardized UI patterns to reduce learning effort across different automotive services." },
                { title: "Trust", desc: "Treated payment and credit screens as critical trust-building moments for enterprise users." }
              ].map((item, i) => (
                <div key={i} className="p-12 rounded-[32px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-all duration-500">
                  <h4 className="text-[12px] uppercase tracking-[0.3em] font-bold mb-6" style={{ color: '#7c5cff' }}>{item.title}</h4>
                  <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', fontWeight: '500' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Designs Section */}
      <section id="final-designs" className="py-64 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-32">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Visual Output</span>
              <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#ffffff' }}>
                Final Designs
              </h2>
            </div>

            {/* Climax: Large hero screen */}
            <div className="relative w-full aspect-[16/9] rounded-[48px] overflow-hidden bg-white/[0.02] border border-white/5 mb-48 shadow-[0_0_100px_rgba(0,0,0,0.5)] group">
              <Image
                src="/Images/carforce/all screens.png"
                alt="Final high-fidelity hero screen showing simplified CTA and benefits"
                fill
                className="object-cover opacity-95 group-hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-center text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Hero: Polished core dashboard with simplified navigation and request status.
                </p>
              </div>
            </div>

            {/* Features recap */}
            <div className="max-w-5xl mx-auto py-32 border-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <h3 className="mb-20 text-[12px] uppercase tracking-[0.3em] text-center font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>System Benefits</h3>
              <div className="grid gap-16 sm:grid-cols-3">
                {[
                  { title: "Progressive Entry", desc: "Forms split into digestible, bite-sized steps to prevent user fatigue." },
                  { title: "Contextual Microcopy", desc: "Human-centric labels and hints that guide users without external training." },
                  { title: "Visual Priority", desc: "Primary actions prioritized across all screens to ensure zero confusion." }
                ].map((feat, i) => (
                  <div key={i} className="text-center space-y-6">
                    <h4 className="font-bold text-[#7c5cff] uppercase tracking-[0.2em] text-xs">{feat.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.8', fontSize: '16px', fontWeight: '500' }}>{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Outcome Section */}
      <section id="outcome" className="py-64 px-6 md:px-12 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-8 block">Results</span>
            <h2 className="mb-16 font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
              Outcome
            </h2>

            <p className="mb-24 leading-relaxed text-2xl md:text-3xl font-medium tracking-tight" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
              The updated experience addressed all major stakeholder concerns and created a cohesive, scalable foundation for launch.
            </p>

            <div className="p-20 rounded-[48px] bg-white/[0.02] border border-white/5 shadow-inner">
              <p className="text-xl md:text-2xl font-medium italic" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                &quot;This case study will be updated with quantitative data as usage metrics become available post-launch.&quot;
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Learnings Section */}
      <section className="py-64 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-center mb-24">
              <span className="text-[12px] uppercase tracking-[0.3em] text-[#7c5cff] font-bold mb-6 block">Retrospective</span>
              <h2 className="font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
                Key Learnings
              </h2>
            </div>
            <div className="grid gap-6">
              {[
                "Fixing UI without fixing flow doesn't work",
                "Payment clarity is both a UX and business problem",
                "Early-stage products benefit from restraint and hierarchy",
                "\"Pay later\" flows require as much care as \"pay now\""
              ].map((learning, i) => (
                <div key={i} className="flex gap-10 items-center p-12 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.03] hover:border-purple-500/20 transition-all duration-500 group">
                  <div className="w-2 h-2 rounded-full bg-[#7c5cff] group-hover:scale-150 transition-transform" />
                  <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', fontWeight: '500' }}>{learning}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reflection Section - Unified into CTA */}
      <section className="py-64 px-6 md:px-12 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="mb-12 font-bold tracking-tight" style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#ffffff' }}>
              Reflections
            </h2>
            <p className="leading-relaxed mb-24 text-xl md:text-2xl" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
              This project reinforced that <span className="text-white underline decoration-[#7c5cff] decoration-2 underline-offset-8">clarity is the foundation of trust</span>. By simplifying complex booking and payment flows, we turned a high-friction process into a fast, predictable experience that builds partner confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Next Case Study CTA Section */}
      <section className="pb-64 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="group relative p-16 md:p-32 rounded-[48px] overflow-hidden bg-white/[0.02] border border-white/5 flex flex-col items-center text-center space-y-12">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="space-y-6 relative z-10">
              <span className="text-[#7c5cff] font-mono text-[12px] uppercase tracking-[0.4em] font-bold">Up Next</span>
              <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">Unduit Refresh App</h2>
              <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-medium">
                How I helped Unduit cut support tickets through guided recovery flows and strategic UX writing.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <Link
                href="/case-studies/unduit"
                className="inline-flex items-center gap-4 px-12 py-6 rounded-full bg-white text-black font-bold hover:bg-[#7c5cff] hover:text-white transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95"
              >
                Read Case Study
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-4 px-12 py-6 rounded-full bg-white/5 text-white/60 font-bold hover:bg-white/10 hover:text-white transition-all duration-500 border border-white/10 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Spacing */}
      <div className="h-24"></div>

      {/* Bottom Floating Nav */}
      <CaseStudyBottomNav 
        nextCaseStudyLink="/case-studies/unduit"
        nextCaseStudyName="Previous Case Study"
      />
    </div>
  );
}
