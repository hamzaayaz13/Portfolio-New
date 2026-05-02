"use client";

import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";

type ViewportVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> & {
  src: string;
  active?: boolean;
  rootMargin?: string;
  visibilityThreshold?: number;
};

export function ViewportVideo({
  src,
  active = true,
  rootMargin = "240px 0px",
  visibilityThreshold = 0.2,
  muted = true,
  playsInline = true,
  preload = "metadata",
  ...props
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin,
        threshold: visibilityThreshold,
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [rootMargin, visibilityThreshold]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (!active || !isVisible) {
      video.pause();
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [active, isVisible, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted={muted}
      playsInline={playsInline}
      preload={preload}
      {...props}
    />
  );
}
