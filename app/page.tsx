"use client";

import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { LinkPreviewDemo } from "@/components/ui/link-preview-demo";
import CaseStudiesSection from "@/components/ui/case-studies-section";

export default function Page() {
  const sections = [
    {
      title: "How I Helped Unduit Cut Support Tickets with Better UX",
      description:
        "Redesigning Unduit's Refresh app to make device recovery and buy-back flows intuitive, guided, and error-free.",
      imageSrc: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/Animated_Spotlight_on_Laptop.mp4",
      buttonText: "View Case Study",
      buttonLink: "/case-studies/unduit",
    },
    {
      title: "Redesigning Dubizzle's Affiliate App for a Faster, Clearer & Frictionless Experience",
      description:
        "Reworking critical service booking and payment flows to reduce friction, improve clarity, and unlock revenue at scale.",
      imageSrc: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/1102.mp4",
      buttonText: "View Case Study",
      buttonLink: "/case-studies/mobile-nav",
    },
    {
      title: "In Progress",
      description: "Work in progress",
      imageSrc: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/Animating_Laptop_Strands_and_Laptop.mp4",
      buttonText: "Coming Soon",
      isLocked: true,
    },
    {
      title: "In Progress",
      description: "Work in progress",
      imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      buttonText: "Coming Soon",
      isLocked: true,
    },
  ];

  const bentoItems = [
    {
      id: "1",
      title: "How I Helped Unduit Cut Support Tickets with Better UX",
      description: "Redesigning Unduit's Refresh app to make device recovery and buy-back flows intuitive.",
      imageSrc: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/Animated_Spotlight_on_Laptop.mp4",
      buttonLink: "/case-studies/unduit",
    },
    {
      id: "2",
      title: "Redesigning Dubizzle's Affiliate App for a Faster, Clearer & Frictionless Experience",
      description: "Reworking critical service booking and payment flows to reduce friction.",
      imageSrc: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/1102.mp4",
      buttonLink: "/case-studies/mobile-nav",
    },
    {
      id: "3",
      title: "In Progress",
      description: "Work in progress",
      imageSrc: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/Animating_Laptop_Strands_and_Laptop.mp4",
      isLocked: true,
    },
    {
      id: "4",
      title: "In Progress",
      description: "Work in progress",
      imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      videoSrc: "/1102.mp4",
      isLocked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/1102.mp4"
        title="Product Designer focused on usability, conversion, and experience"
        scrollToExpand="Scroll to Expand"
        textBlend
      >
        {/* Link Preview Demo Section */}
        <div className="mt-24 mb-24">
          <LinkPreviewDemo />
        </div>
      </ScrollExpandMedia>

      {/* Case Studies Section */}
      <CaseStudiesSection
        title="Case Studies"
        sections={sections}
        bentoItems={bentoItems}
        sensitivityMultiplier={1.2}
        wrapperHeightVh={210}
      />
    </div>
  );
}
