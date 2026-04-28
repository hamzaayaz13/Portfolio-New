"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

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

export default function Page() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeAudience, setActiveAudience] = useState("anyone");
  const [showIntro, setShowIntro] = useState(!hasShownHomeIntroThisVisit);

  useEffect(() => {
    if (!showIntro) return;
    const timer = window.setTimeout(() => {
      setShowIntro(false);
      hasShownHomeIntroThisVisit = true;
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [showIntro]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 320;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToWork = () => {
    if (typeof window !== "undefined" && window.location.hash !== "#work") {
      window.history.pushState(null, "", "/#work");
      window.dispatchEvent(new Event("hashchange"));
    }
    const element = document.getElementById("work");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeAudienceContent =
    AUDIENCES.find((audience) => audience.id === activeAudience) ?? AUDIENCES[0];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] relative">
      <a
        href="https://cursor.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`${showIntro ? "hero-reveal hero-reveal-5" : "hero-reveal-now"} cursor-badge-shine fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[var(--accent)]/25 bg-[var(--bg)]/95 backdrop-blur-sm px-4 py-2 text-[12px] md:text-[13px] font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:shadow-md transition-all shadow-sm`}
      >
        <span className="relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]" aria-hidden>
          ✦
        </span>
        <span className="relative z-10">Vibecoded on Cursor</span>
      </a>

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
          Hello, my name is <span className="text-[var(--accent)]">Hamza</span>
        </h1>
      </div>

      {/* Hero section - appears as intro leaves */}
      <section className="min-h-[100svh] flex flex-col justify-center relative">
        <div className="container-main py-12 md:py-20 flex flex-col items-stretch w-full min-w-0 text-left">
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
                className={`flex-shrink-0 w-[320px] md:w-[380px] group ${study.href === "#" ? "pointer-events-none" : ""}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative h-[450px] md:h-[500px] rounded-2xl overflow-hidden bg-[#0a0a0a]"
                >
                  {study.video ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={study.video}
                      autoPlay
                      muted
                      loop
                      playsInline
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
