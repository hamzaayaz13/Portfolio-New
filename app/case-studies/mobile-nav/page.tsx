'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MobileNavCaseStudy() {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] font-sans">
      
      {/* 2. HERO — WHAT IS THIS PROJECT? */}
      <section className="min-h-[90dvh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
          Redesigning CarForce.
        </h1>
        <p className="text-xl md:text-3xl text-[#1d1d1f] max-w-3xl leading-relaxed mb-6">
          A redesign of Dubizzle&apos;s affiliate app to make service booking and payments fast, predictable, and trustworthy.
        </p>
        <span className="text-sm text-[#86868b] tracking-wide">
          Product Design · Mobile App · 3-Week Sprint
        </span>
      </section>

      {/* 3. CONTEXT — WHO IS THIS FOR? */}
      <section className="py-48 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Who uses CarForce.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            CarForce is used by automotive partners in Dubai — car vendors and bank representatives — to book evaluations, insurance, and financing on behalf of customers.
          </p>
          
          {/* Placeholder block */}
          <div className="mt-20 w-full h-[400px] bg-[#e8e8ed] rounded-sm" />
        </div>
      </section>

      {/* 4. THE ORIGINAL EXPERIENCE — WHAT WAS BROKEN? */}
      <section className="py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Where the experience broke down.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            The original app suffered from inconsistent UI, unclear actions, and fragmented flows. Simple tasks required too much thinking, and critical steps — especially payments — felt uncertain.
          </p>
          
          {/* Placeholder block */}
          <div className="mt-20 w-full h-[500px] bg-[#d2d2d7] rounded-sm" />
        </div>
      </section>

      {/* 5. WHY THIS MATTERED — BUSINESS + UX */}
      <section className="py-48 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-20">
            Why this couldn&apos;t ship.
          </h2>
          <div className="space-y-10">
            <p className="text-xl md:text-2xl text-[#1d1d1f] leading-relaxed">
              Payments were the primary revenue moment.
            </p>
            <p className="text-xl md:text-2xl text-[#1d1d1f] leading-relaxed">
              Friction increased abandonment.
            </p>
            <p className="text-xl md:text-2xl text-[#1d1d1f] leading-relaxed">
              Visual inconsistency reduced trust.
            </p>
            <p className="text-xl md:text-2xl text-[#1d1d1f] leading-relaxed">
              Partners lacked confidence completing requests.
            </p>
          </div>
        </div>
      </section>

      {/* 6. DESIGN INTENT — WHAT CHANGED? */}
      <section className="py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Designing for momentum.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            The redesign focused on reducing cognitive load, clarifying pricing, and creating predictable flows — so partners could move forward without second-guessing their actions.
          </p>
        </div>
      </section>

      {/* 7. CORE USER JOURNEY — MAKE IT OBVIOUS */}
      <section className="py-48 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-20">
            The booking flow.
          </h2>
          <p className="text-xl md:text-2xl text-[#1d1d1f] mb-20">
            Select service → Submit details → Pay now or later → Track request
          </p>
          
          {/* Horizontal placeholder block */}
          <div className="w-full h-[300px] bg-[#e8e8ed] rounded-sm" />
        </div>
      </section>

      {/* 8. KEY IMPROVEMENTS — TIED TO THE JOURNEY */}
      
      {/* Section 1: Service Selection */}
      <section className="py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Service selection without friction.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            Services and forms were broken into focused steps, reducing overwhelm and helping users move forward without hesitation.
          </p>
          
          {/* Placeholder block */}
          <div className="mt-20 w-full h-[500px] bg-[#d2d2d7] rounded-sm" />
        </div>
      </section>

      {/* Section 2: Payments */}
      <section className="py-48 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Payments that build confidence.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            Pricing breakdowns, credit usage, and totals were made explicit — removing ambiguity at checkout.
          </p>
          
          {/* Placeholder block */}
          <div className="mt-20 w-full h-[500px] bg-[#e8e8ed] rounded-sm" />
        </div>
      </section>

      {/* Section 3: Requests */}
      <section className="py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            Requests you can track.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            Clear request states and flexible payment options allowed partners to manage multiple bookings with confidence.
          </p>
          
          {/* Placeholder block */}
          <div className="mt-20 w-full h-[500px] bg-[#d2d2d7] rounded-sm" />
        </div>
      </section>

      {/* 9. DESIGN DECISIONS — HOW YOU THOUGHT */}
      <section className="py-48 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-20">
            Design decisions.
          </h2>
          <div className="space-y-16">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Hierarchy</h3>
              <p className="text-lg md:text-xl text-[#424245] leading-relaxed">
                Whitespace over density.
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Consistency</h3>
              <p className="text-lg md:text-xl text-[#424245] leading-relaxed">
                One system across services.
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Trust</h3>
              <p className="text-lg md:text-xl text-[#424245] leading-relaxed">
                Payments treated as reassurance moments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. OUTCOME — WHAT DID THIS ACHIEVE? */}
      <section className="py-48 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">
            The result.
          </h2>
          <p className="text-xl md:text-2xl text-[#424245] leading-relaxed max-w-3xl">
            The redesign resolved stakeholder concerns and created a cohesive, scalable foundation for launch.
          </p>
        </div>
      </section>

      {/* 11. FINAL TAKEAWAY — CLOSE THE LOOP */}
      <section className="py-64 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Clarity is the foundation of trust.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-32 px-6 border-t border-[#e8e8ed]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-lg font-medium text-[#1d1d1f] hover:text-[#86868b] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <Link
            href="/case-studies/unduit"
            className="inline-flex items-center gap-3 text-lg font-medium text-[#1d1d1f] hover:text-[#86868b] transition-colors"
          >
            Next Case Study
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </section>

    </div>
  );
}
