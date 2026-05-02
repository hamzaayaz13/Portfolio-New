"use client";

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const isWorkLink = (link: string) => link === "/#work" || link === "#work";

const scrollToWork = () => {
  const element = document.getElementById("work");
  if (element) {
    const offset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

export const FloatingNav = ({
  navItems,
}: {
  navItems: {
    name: string;
    link: string;
  }[];
}) => {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  const readHash = useCallback(() => {
    if (typeof window === "undefined") return;
    setHash(window.location.hash);
  }, []);

  useLayoutEffect(() => {
    readHash();
  }, [readHash]);

  useEffect(() => {
    readHash();
  }, [pathname, readHash]);

  useEffect(() => {
    window.addEventListener("hashchange", readHash);
    window.addEventListener("popstate", readHash);
    return () => {
      window.removeEventListener("hashchange", readHash);
      window.removeEventListener("popstate", readHash);
    };
  }, [readHash]);

  const isCaseStudy = pathname?.startsWith("/case-studies") ?? false;
  const isGestureCamera = pathname === "/personal-projects/gesture-camera";
  const isHome = pathname === "/";
  const isContact = pathname === "/contact";
  const isWorkHash = isHome && hash === "#work";

  const isActive = (name: string) => {
    if (name === "Home") {
      return isHome && !isWorkHash;
    }
    if (name === "Work") {
      return isCaseStudy || isWorkHash;
    }
    if (name === "Contact") {
      return isContact;
    }
    return false;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (!isWorkLink(link)) return;
    // On home: keep SPA-style hash + scroll. Elsewhere: let `<Link href="/#work">` handle
    // navigation — `router.push("/#work")` is unreliable in the App Router (hash/back).
    if (pathname === "/") {
      e.preventDefault();
      if (window.location.hash !== "#work") {
        window.history.pushState(null, "", "/#work");
        setHash("#work");
      }
      requestAnimationFrame(() => scrollToWork());
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      className={`fixed inset-x-0 z-[99999] mx-auto flex w-fit flex-col items-end ${
        isGestureCamera ? "top-6" : "top-[var(--space-s)]"
      }`}
    >
      <nav
        className={
          isGestureCamera
            ? "flex max-w-fit items-center gap-8 bg-transparent px-0 py-0"
            : "flex max-w-fit items-center gap-0.5 rounded-full border border-[var(--subtle)] bg-white/80 px-1 py-1 shadow-[0_10px_30px_rgba(11,11,11,0.06)] backdrop-blur-md"
        }
      >
        {navItems.map((navItem, idx) => (
          <Link
            key={`link-${idx}`}
            href={navItem.link}
            scroll={isWorkLink(navItem.link) ? false : true}
            onClick={(e) => handleLinkClick(e, navItem.link)}
            className={
              isGestureCamera
                ? "text-[12px] font-semibold uppercase tracking-[0.24em] text-white/65 transition-all duration-[250ms] hover:text-white hover:[text-shadow:0_0_16px_rgba(77,163,255,0.35)]"
                : `px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
                    isActive(navItem.name)
                      ? "text-[var(--text)] bg-[var(--muted-bg)]"
                      : "text-[var(--muted-text)] hover:text-[var(--text)] hover:bg-[var(--muted-bg)]/80"
                  }`
            }
            aria-current={isActive(navItem.name) ? "page" : undefined}
          >
            {navItem.name}
          </Link>
        ))}
        <a
          href="/Resume/Hamza%20Ayaz%20-%20CV(R)%20.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={
            isGestureCamera
              ? "text-[12px] font-semibold uppercase tracking-[0.24em] text-white/65 transition-all duration-[250ms] hover:text-white hover:[text-shadow:0_0_16px_rgba(77,163,255,0.35)]"
              : "ml-0.5 px-4 py-2 rounded-full text-[14px] font-medium border border-[var(--text)] text-[var(--text)] hover:bg-[var(--text)] hover:text-white transition-colors"
          }
        >
          Resume
        </a>
      </nav>

      {!isGestureCamera && <div className="relative mr-5 flex h-16 flex-col items-center">
        <div className="relative h-5 w-8" aria-hidden>
          <span className="absolute left-2 top-0 h-6 w-px origin-top rotate-[-14deg] bg-[rgba(11,11,11,0.16)]" />
          <span className="absolute right-2 top-0 h-6 w-px origin-top rotate-[14deg] bg-[rgba(11,11,11,0.16)]" />
        </div>
        <a
          href="https://cursor.com"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-hanging-tag cursor-badge-shine relative inline-flex items-center gap-1.5 overflow-hidden rounded-[14px] border border-white/75 bg-white/70 px-3.5 py-2 text-[11px] font-semibold text-[var(--text)] shadow-[0_14px_35px_rgba(11,11,11,0.1)] backdrop-blur-md transition-colors hover:bg-white/85"
        >
          <span className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-[rgba(11,11,11,0.16)] bg-white/80" aria-hidden />
          <span className="relative z-10 text-[var(--accent)]" aria-hidden>
            ✦
          </span>
          <span className="relative z-10">Vibe coded on Cursor</span>
        </a>
      </div>}
    </motion.div>
  );
};
