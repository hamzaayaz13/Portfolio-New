"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      
      {/* HERO */}
      <section className="pt-[var(--space-xxl)] pb-[var(--space-xl)]">
        <div className="container-main">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-[640px]">
            <small className="label block mb-[var(--space-xxs)]">Contact</small>
            <h1 className="h1 mb-[var(--space-xs)]">Let&apos;s connect.</h1>
            <p className="body-text text-[19px]">
              Have a project in mind or want to discuss design?
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN */}
      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <div className="grid md:grid-cols-2 gap-[var(--space-l)] items-start">
              {/* Photo */}
              <figure>
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden visual-shadow max-w-[400px]">
                  <Image src="/Images/carforce/own-picture.jpeg" alt="Hamza Ayaz" fill className="object-cover" />
                </div>
              </figure>

              {/* Content */}
              <div className="max-w-[400px]">
                <small className="label block mb-[var(--space-xxs)]">About</small>
                <h2 className="h2 mb-[var(--space-xs)]">Hamza Ayaz</h2>
                <p className="body-text mb-[var(--space-s)]">
                  Product Designer at Dubizzle Group with experience across B2C, B2B, and enterprise SaaS. I focus on reducing friction and building experiences that earn trust.
                </p>
                <p className="body-text text-[15px] mb-[var(--space-l)]">
                  Based in Dubai. Available for remote and on-site.
                </p>

                {/* Links */}
                <div className="space-y-[var(--space-xs)]">
                  <a href="mailto:hamzaayaz53@gmail.com" className="block p-[var(--space-s)] rounded border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors">
                    <p className="text-[15px] font-medium">Email</p>
                    <p className="text-[14px] text-[var(--muted-text)]">hamzaayaz53@gmail.com</p>
                  </a>
                  <a href="https://www.linkedin.com/in/muhammadhamzaayaz/" target="_blank" rel="noopener noreferrer" className="block p-[var(--space-s)] rounded border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors">
                    <p className="text-[15px] font-medium">LinkedIn</p>
                    <p className="text-[14px] text-[var(--muted-text)]">Connect with me</p>
                  </a>
                  <a href="/resume new dubai.pdf" target="_blank" rel="noopener noreferrer" className="block p-[var(--space-s)] rounded border border-[var(--subtle)] hover:border-[var(--muted-text)] transition-colors">
                    <p className="text-[15px] font-medium">Resume</p>
                    <p className="text-[14px] text-[var(--muted-text)]">Download PDF</p>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NAV */}
      <nav className="py-[var(--space-m)] border-t border-[var(--subtle)]">
        <div className="container-main">
          <Link href="/" className="text-[15px] text-[var(--accent)] hover:underline">← Home</Link>
        </div>
      </nav>
    </div>
  );
}
