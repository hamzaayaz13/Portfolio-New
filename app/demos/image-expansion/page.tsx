'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

const sampleMediaContent = {
  src: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1280&auto=format&fit=crop',
  background:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
  title: 'Dynamic Image Showcase',
  date: 'Underwater Adventure',
  scrollToExpand: 'Scroll to Expand Demo',
  about: {
    overview:
      'This is a demonstration of the ScrollExpandMedia component with an image. The same smooth expansion effect works beautifully with static images, allowing you to create engaging visual experiences without video content.',
    conclusion:
      'The ScrollExpandMedia component works equally well with images and videos. This flexibility allows you to choose the media type that best suits your content while maintaining the same engaging user experience.',
  },
};

const MediaContent = () => {
  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-3xl font-bold mb-6 text-black dark:text-white'>
        About This Component
      </h2>
      <p className='text-lg mb-8 text-black dark:text-white'>
        {sampleMediaContent.about.overview}
      </p>

      <p className='text-lg mb-8 text-black dark:text-white'>
        {sampleMediaContent.about.conclusion}
      </p>
    </div>
  );
};

export default function ImageExpansion() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType='image'
        mediaSrc={sampleMediaContent.src}
        bgImageSrc={sampleMediaContent.background}
        title={sampleMediaContent.title}
        date={sampleMediaContent.date}
        scrollToExpand={sampleMediaContent.scrollToExpand}
      >
        <MediaContent />
      </ScrollExpandMedia>
    </div>
  );
}





