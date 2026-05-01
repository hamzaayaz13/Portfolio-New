import Link from "next/link";
import { notFound } from "next/navigation";

const PROJECTS = {
  "motion-playground": {
    eyebrow: "Personal Project / Motion Prototype",
    title: "Micro-interaction playground.",
    body:
      "A small space for testing interface motion, timing, hover states, and feedback patterns before using them inside bigger product flows.",
    details: [
      "Explore button, card, modal, and navigation transitions.",
      "Compare subtle animation timings and easing styles.",
      "Keep the experiments simple so useful patterns can be reused later.",
    ],
  },
  "ai-interface": {
    eyebrow: "Personal Project / AI Experience",
    title: "Simple assistant interface.",
    body:
      "A lightweight concept for an assistant-style interface that takes rough user input and turns it into clear, structured next steps.",
    details: [
      "Start with a simple prompt area and guided examples.",
      "Convert messy notes into sections, actions, or project tasks.",
      "Focus on clarity instead of making the interface feel complex.",
    ],
  },
  "interface-lab": {
    eyebrow: "Personal Project / Interface Lab",
    title: "Design system sandbox.",
    body:
      "A compact lab for trying reusable interface patterns, hierarchy, layout rules, and interaction details before they become part of a larger system.",
    details: [
      "Prototype card, navigation, and content patterns in isolation.",
      "Stress test spacing, hierarchy, and responsive behavior.",
      "Turn useful experiments into reusable product design patterns.",
    ],
  },
};

type ProjectSlug = keyof typeof PROJECTS;

export function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

export default function PersonalProjectPage({ params }: { params: { slug: string } }) {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const project = PROJECTS[slug as ProjectSlug];

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <section className="pt-[var(--space-xxl)] pb-[var(--space-xl)]">
        <div className="container-main">
          <div className="max-w-[760px]">
            <small className="label block mb-[var(--space-xxs)]">{project.eyebrow}</small>
            <h1 className="h1 mb-[var(--space-xs)]">{project.title}</h1>
            <p className="body-text text-[19px]">{project.body}</p>
          </div>
        </div>
      </section>

      <section className="section-gap bg-[var(--muted-bg)]">
        <div className="container-main">
          <div className="grid gap-[var(--space-l)] md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <small className="label block mb-[var(--space-xxs)]">Concept</small>
              <h2 className="h2 mb-[var(--space-xs)]">How it could work.</h2>
              <p className="body-text">
                This page is intentionally simple for now. It gives the project a place to live while the actual interaction, visuals, and prototype details are customized later.
              </p>
            </div>

            <div className="space-y-3">
              {project.details.map((detail, index) => (
                <div key={detail} className="rounded-2xl border border-[var(--subtle)] bg-white p-5 shadow-sm">
                  <p className="mb-2 font-mono text-[13px] text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="text-[16px] leading-relaxed text-[var(--muted-text)]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <nav className="py-[var(--space-m)] border-t border-[var(--subtle)]">
        <div className="container-main">
          <Link href="/#work" scroll={false} className="text-[15px] text-[var(--accent)] hover:underline">
            ← Back to home
          </Link>
        </div>
      </nav>
    </div>
  );
}
