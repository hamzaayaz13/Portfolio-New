/**
 * Example usage of CaseStudiesSection component
 * 
 * This component provides a toggleable case studies section with:
 * - Detailed view: Rotating gradient scroll component
 * - Simplified view: Bento grid layout
 */

import CaseStudiesSection from "./case-studies-section";

export function CaseStudiesExample() {
  const sections = [
    {
      title: "Project 1",
      description: "Description of your first project.",
      imageSrc: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=800&auto=format&fit=crop",
      buttonText: "View Case Study",
      buttonLink: "/case-studies/project-1", // Optional: link to case study page
    },
    {
      title: "Project 2",
      description: "Description of your second project.",
      imageSrc: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop",
      buttonText: "Learn More",
      // No buttonLink means it won't be clickable
    },
    {
      title: "Project 3",
      description: "Description of your third project.",
      imageSrc: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop",
      buttonText: "Explore",
    },
    {
      title: "Project 4",
      description: "Description of your fourth project.",
      imageSrc: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop",
      buttonText: "View Details",
    },
  ];

  const bentoItems = [
    {
      id: "1",
      title: "Project 1",
      description: "Short description for bento grid view.",
      videoSrc: "/portfolio-video.mp4", // Optional
    },
    {
      id: "2",
      title: "Project 2",
      description: "Short description for bento grid view.",
      videoSrc: "/portfolio-video.mp4",
    },
    {
      id: "3",
      title: "Project 3",
      description: "Short description for bento grid view.",
    },
    {
      id: "4",
      title: "Project 4",
      description: "Short description for bento grid view.",
      videoSrc: "/portfolio-video.mp4",
    },
  ];

  return (
    <CaseStudiesSection
      title="My Projects"
      sections={sections}
      bentoItems={bentoItems}
      sensitivityMultiplier={1.2}
      wrapperHeightVh={210}
    />
  );
}




