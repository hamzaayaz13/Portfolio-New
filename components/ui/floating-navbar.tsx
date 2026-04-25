"use client";

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
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
    if (isWorkLink(link)) {
      e.preventDefault();
      if (pathname === "/") {
        if (window.location.hash !== "#work") {
          window.history.pushState(null, "", "/#work");
          setHash("#work");
        }
        requestAnimationFrame(() => scrollToWork());
      } else {
        void router.push("/#work");
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
          className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
            isActive(navItem.name)
              ? "text-[var(--text)] bg-[var(--muted-bg)]"
              : "text-[var(--muted-text)] hover:text-[var(--text)] hover:bg-[var(--muted-bg)]/80"
          }`}
          aria-current={isActive(navItem.name) ? "page" : undefined}
        >
          {navItem.name}
        </Link>
      ))}
      <a 
        href="/Resume/Hamza%20Ayaz%20-%20CV(R)%20.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ml-0.5 px-4 py-2 rounded-full text-[14px] font-medium border border-[var(--text)] text-[var(--text)] hover:bg-[var(--text)] hover:text-white transition-colors"
      >
        Resume
      </a>
    </motion.nav>
  );
};
