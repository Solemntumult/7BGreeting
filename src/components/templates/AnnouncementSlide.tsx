"use client";

import Image from 'next/image';
import { SlideData } from '@/data/curatedSequence';
import { motion } from 'framer-motion';

interface AnnouncementSlideProps {
  slide: SlideData;
}

export default function AnnouncementSlide({ slide }: AnnouncementSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black select-none"
    >
      {/* Background Image with Continuous Ken Burns Motion */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={slide.imageUrl}
          alt={slide.title || 'Seven B Slide'}
          fill
          className="object-cover"
          priority
        />
        {/* Soft, natural full-screen darkening veil for legibility (NO rectangle box) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/70" />
      </motion.div>

      {/* Content — Pure White Typography, Absolutely NO BOX */}
      <div className="relative z-10 max-w-6xl mx-auto px-12 sm:px-20 text-center flex flex-col items-center pointer-events-none">
        {/* Category / Eyebrow (Pure white with wide tracking, no box/background) */}
        {slide.category && (
          <motion.div
            initial={{ opacity: 0, y: -25, letterSpacing: '0.4em' }}
            animate={{ opacity: 0.9, y: 0, letterSpacing: '0.3em' }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-[0.3em] mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
          >
            SEVEN B • {slide.category}
          </motion.div>
        )}

        {/* Main Title (Pure white, bold luxury styling, drop shadow) */}
        {slide.title && (
          <motion.h1
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-[1.1] mb-6"
          >
            {slide.title}
          </motion.h1>
        )}

        {/* Description / Message (Pure white, light font weight, elegant leading) */}
        {slide.description && (
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.85 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 font-light max-w-5xl leading-relaxed drop-shadow-[0_3px_16px_rgba(0,0,0,0.9)] tracking-wide"
          >
            {slide.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
