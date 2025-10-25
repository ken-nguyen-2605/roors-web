import React from 'react';
import SlideBackground from '@/utils/Slidebackground';

const backgroundImages = [
  '/background/bg1.jpg',
  '/background/bg2.jpg',
  '/background/bg3.jpg',
  '/background/bg4.jpg',
];

export default function AdminBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <SlideBackground
        images={backgroundImages}
        interval={5000}
        transitionDuration={1000}
        className="h-full w-full"
      />
    </div>
  );
}
