"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link === "#work") {
      e.preventDefault();
      
      // Tell the hero to expand first
      window.dispatchEvent(new CustomEvent('force-expand-hero'));

      if (pathname === "/") {
        // Wait a tiny bit for the hero state to update
        setTimeout(() => {
          const element = document.getElementById("work");
          if (element) {
            const offset = 100; // Offset for header or spacing
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          }
        }, 100);
      } else {
        router.push("/#work");
      }
    }
  };

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/20 rounded-full bg-zinc-900/90 backdrop-blur-md z-[99999] pr-2 pl-8 py-3 items-center justify-center space-x-4 shadow-2xl",
        className
      )}
    >
      {navItems.map((navItem: { name: string; link: string; icon?: JSX.Element }, idx: number) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          onClick={(e) => handleLinkClick(e, navItem.link)}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          {navItem.icon && <span className="block sm:hidden">{navItem.icon}</span>}
          <span className="text-sm cursor-pointer">{navItem.name}</span>
        </Link>
      ))}
      <a 
        href="/Resume.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="border text-sm font-medium relative border-white/[0.2] text-white px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <span>Resume</span>
        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-purple-500 to-transparent h-px" />
      </a>
    </motion.div>
  );
};

