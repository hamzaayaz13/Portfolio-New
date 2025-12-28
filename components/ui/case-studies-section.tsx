"use client";

import React, { useState } from "react";
import BentoGrid from "./bento-grid";
import RotatingGradientRight from "./rotating-gradient-right";
import { CaseStudyModal } from "./case-study-modal";

type BentoItem = {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  videoSrc?: string;
  isLocked?: boolean;
  buttonLink?: string;
};

type Section = {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
  buttonLink?: string;
  isLocked?: boolean;
};

type CaseStudiesSectionProps = {
  title?: string;
  titleClassName?: string;
  sections: Section[];
  bentoItems: BentoItem[];
  sensitivityMultiplier?: number;
  wrapperHeightVh?: number;
  className?: string;
};

export default function CaseStudiesSection({
  title = "Case studies",
  titleClassName,
  sections,
  bentoItems,
  sensitivityMultiplier = 1.2,
  wrapperHeightVh = 210,
  className = "",
}: CaseStudiesSectionProps) {
  const [simplified, setSimplified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLockedClick = () => {
    setIsModalOpen(true);
  };

  return (
    <section id="work" className={`${className}`}>
      <CaseStudyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* Combined container for header and sticky scrolling */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-6 mb-12 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className={titleClassName || "text-4xl sm:text-5xl font-bold tracking-tight mb-4"}>
              {title}
            </h2>
            <p className="text-neutral-500 text-lg max-w-lg">
              A selection of projects where I solved complex problems through user research and design systems.
            </p>
          </div>
          
          {/* Minimalist Toggle Switch */}
          <div className="flex items-center gap-1 p-1 bg-[#111] rounded-full border border-white/5">
            <button
              onClick={() => setSimplified(false)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                !simplified ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => setSimplified(true)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                simplified ? "bg-white text-black shadow-lg" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Simplified
            </button>
          </div>
        </div>
      </div>

      {simplified ? (
        <div className="w-full">
          <BentoGrid fullBleed items={bentoItems} onLockedClick={handleLockedClick} />
        </div>
      ) : (
        <div className="px-6 py-1">
          <RotatingGradientRight
            sections={sections}
            sensitivityMultiplier={sensitivityMultiplier}
            wrapperHeightVh={wrapperHeightVh}
            onLockedClick={handleLockedClick}
          />
        </div>
      )}
      </div>
    </section>
  );
}

