"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CaseStudyBottomNavProps {
  nextCaseStudyLink?: string;
  nextCaseStudyName?: string;
}

export const CaseStudyBottomNav = ({ 
  nextCaseStudyLink = "/case-studies/mobile-nav",
  nextCaseStudyName = "Next Case Study"
}: CaseStudyBottomNavProps) => {
  return (
    <div className="fixed bottom-6 md:bottom-10 inset-x-0 z-[60] flex justify-center px-4 md:px-6 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex items-center gap-1.5 md:gap-3 p-1.5 md:p-2 rounded-full bg-black/60 backdrop-blur-2xl border border-white/10 shadow-2xl pointer-events-auto max-w-[95vw] overflow-hidden"
      >
        <Link
          href="mailto:hamzaayaz53@gmail.com"
          className="px-3 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
        >
          Email Me
        </Link>
        <div className="w-px h-4 bg-white/10 shrink-0" />
        <Link
          href="/"
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all whitespace-nowrap"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden xs:inline">Back Home</span>
          <span className="xs:hidden">Home</span>
        </Link>
        <div className="w-px h-4 bg-white/10 shrink-0" />
        <Link
          href={nextCaseStudyLink}
          className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-white text-black text-[10px] sm:text-xs md:text-sm font-bold hover:bg-purple-500 hover:text-white transition-all whitespace-nowrap shadow-lg"
        >
          <span className="hidden xs:inline">{nextCaseStudyName}</span>
          <span className="xs:hidden">Next</span>
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 rotate-180" />
        </Link>
      </motion.div>
    </div>
  );
};
