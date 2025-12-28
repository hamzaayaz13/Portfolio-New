"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0b0f12] text-white selection:bg-purple-500/30 pt-40 pb-20 px-8">
      <main className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-24 items-center">
          
          {/* LEFT COLUMN — TEXT (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <span className="text-[12px] uppercase tracking-[0.3em] text-white/50 font-bold block">
                Product Designer
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Hamza Ayaz
              </h1>
            </div>

            <div className="space-y-8 max-w-[54ch]">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium">
                I started in fashion marketing, learning how people notice, desire, and emotionally connect with products. That perspective led me into product design — where clarity, structure, and real user behavior matter more than surface-level aesthetics.
              </p>
              <p className="text-base md:text-lg text-white/60 leading-relaxed font-medium">
                Today, I design large-scale marketplace and consumer products at Dubizzle Group, focusing on reducing friction, making decisions obvious, and building experiences that quietly earn trust.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <a
                href="mailto:hamzaayaz53@gmail.com"
                className="px-10 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-purple-500 hover:text-white transition-all duration-500 shadow-xl active:scale-95"
                onClick={(e) => {
                  window.location.href = "mailto:hamzaayaz53@gmail.com";
                }}
              >
                Email me
              </a>
              <a
                href="https://www.linkedin.com/in/muhammadhamzaayaz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white font-bold text-base transition-colors underline-offset-8 hover:underline"
              >
                View LinkedIn
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN — IMAGE (40%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] lg:aspect-[3/4] rounded-[40px] overflow-hidden bg-white/[0.02] border border-white/5 shadow-2xl"
          >
            <Image
              src="/Images/carforce/own-picture.jpeg"
              alt="Hamza Ayaz"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>

        </div>
      </main>
    </div>
  );
}


