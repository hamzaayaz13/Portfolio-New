'use client';

import { useEffect } from 'react';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

const sampleMediaContent = {
  src: '/portfolio-video.mp4',
  poster: '',
  background:
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
  title: 'Product Designer focused on usability, conversion, and experience',
  date: 'Hamza Ayaz',
  scrollToExpand: 'Scroll to Expand Demo',
  about: {
    overview:
      'This is a demonstration of the ScrollExpandMedia component with a video. As you scroll, the video expands to fill more of the screen, creating an immersive experience. This component is perfect for showcasing video content in a modern, interactive way.',
    conclusion:
      'The ScrollExpandMedia component provides a unique way to engage users with your content through interactive scrolling. Try switching between video and image modes to see different implementations.',
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

export default function VideoExpansion() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const resetEvent = new Event('resetSection');
    window.dispatchEvent(resetEvent);
  }, []);

  return (
    <div className='min-h-screen'>
      <ScrollExpandMedia
        mediaType='video'
        mediaSrc={sampleMediaContent.src}
        posterSrc={sampleMediaContent.poster}
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

