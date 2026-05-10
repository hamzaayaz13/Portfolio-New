"use client";

import Image from "next/image";
import {
  DraggableContainer,
  GridBody,
  GridItem,
} from "@/components/ui/infinite-drag-scroll";
import { ViewportVideo } from "@/components/ui/viewport-video";

export type ExpandedWorkGalleryItem = {
  id: string;
  alt: string;
  src: string;
  mediaType: "image" | "video";
};

export function ExpandedWorkGallery({
  items,
}: {
  items: ExpandedWorkGalleryItem[];
}) {
  return (
    <DraggableContainer variant="masonry">
      <GridBody>
        {items.map((image) => (
          <GridItem
            key={image.id}
            className="group relative aspect-video h-auto w-[340px] md:w-[560px]"
          >
            {image.mediaType === "video" ? (
              <ViewportVideo
                src={image.src}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="none"
                aria-label={image.alt}
              />
            ) : (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 560px, 340px"
                className="pointer-events-none object-cover"
              />
            )}
          </GridItem>
        ))}
      </GridBody>
    </DraggableContainer>
  );
}
