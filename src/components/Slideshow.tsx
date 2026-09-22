"use client";

import { useState, useEffect } from 'react';
import { Slide } from '@/data/slides';
import { AnimatePresence } from 'framer-motion';
import PhotoSlide from './templates/PhotoSlide';
import AnnouncementSlide from './templates/AnnouncementSlide';

interface SlideshowProps {
  slides: Slide[];
}

export default function Slideshow({ slides }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const currentSlide = slides[currentIndex];
    const duration = currentSlide.duration || 10000; // Default to 10 seconds

    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  if (slides.length === 0) {
    return <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl">No slides available</div>;
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {currentSlide.type === 'photo' && (
          <PhotoSlide key={currentSlide.id} slide={currentSlide} />
        )}
        {currentSlide.type === 'announcement' && (
          <AnnouncementSlide key={currentSlide.id} slide={currentSlide} />
        )}
      </AnimatePresence>
    </div>
  );
}
