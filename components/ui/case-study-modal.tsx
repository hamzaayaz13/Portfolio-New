"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CaseStudyModal({ isOpen, onClose }: CaseStudyModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900/90 p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            {/* Decorative Glow */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-500/20 blur-[80px]" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/20 blur-[80px]" />

            <button
              onClick={onClose}
              className="absolute right-8 top-8 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <div className="relative space-y-8 pt-4">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                    </span>
                    Work in Progress
                  </div>
                  <h3 className="text-4xl font-bold text-white tracking-tight">
                    In Progress
                  </h3>
                  <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                    “Somewhere between meetings, deadlines, and Jira tickets — this case study is still in progress.”
                  </p>
                </div>

                <div className="space-y-6">
                  <p className="text-base text-zinc-500 leading-relaxed">
                    This project is actively being worked on. If you&apos;re curious, I can share an early draft with you directly.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative group">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-zinc-600 focus:border-purple-500/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all group-hover:bg-white/10"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-white px-6 py-4 text-base font-bold text-black transition-all hover:bg-purple-500 hover:text-white active:scale-[0.98] shadow-xl"
                    >
                      Send me the rough draft
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative space-y-8 py-10 text-center"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/10 text-5xl">
                  😅
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white tracking-tight">Under Construction</h3>
                  <p className="text-lg text-zinc-400 leading-relaxed max-w-[280px] mx-auto">
                    This feature is also under construction... <br />
                    <span className="text-white font-medium">But your email is noted!</span> I&apos;ll send something your way soon.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white hover:text-black"
                >
                  Back to portfolio
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

