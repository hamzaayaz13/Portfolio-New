"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export const FloatingNav = ({
  navItems,
}: {
  navItems: {
    name: string;
    link: string;
  }[];
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link === "#work") {
      e.preventDefault();
      if (pathname === "/") {
        const element = document.getElementById("work");
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      } else {
        router.push("/#work");
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className="flex max-w-fit fixed top-[var(--space-s)] inset-x-0 mx-auto border border-[var(--subtle)] rounded-full bg-white/90 backdrop-blur-sm z-[99999] px-1 py-1 items-center gap-0.5"
    >
      {navItems.map((navItem, idx) => (
        <Link
          key={`link-${idx}`}
          href={navItem.link}
          onClick={(e) => handleLinkClick(e, navItem.link)}
          className="px-4 py-2 rounded-full text-[14px] font-medium text-[var(--muted-text)] hover:text-[var(--text)] hover:bg-[var(--muted-bg)] transition-colors"
        >
          {navItem.name}
        </Link>
      ))}
      <a 
        href="/resume new dubai.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ml-0.5 px-4 py-2 rounded-full text-[14px] font-medium border border-[var(--text)] text-[var(--text)] hover:bg-[var(--text)] hover:text-white transition-colors"
      >
        Resume
      </a>
    </motion.nav>
  );
};
