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
      className="relative w-full h-full flex flex-col justify-end overflow-hidden bg-black select-none"
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
        {/* Discreet bottom vignette: keeps 70% of the photo completely clear and bright */}
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
      </motion.div>

      {/* Discreet, Refined White Typography positioned at the bottom */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 sm:px-14 pb-12 sm:pb-16 text-center flex flex-col items-center pointer-events-none">
        {/* Category / Eyebrow */}
        {slide.category && (
          <motion.div
            initial={{ opacity: 0, y: 15, letterSpacing: '0.35em' }}
            animate={{ opacity: 0.85, y: 0, letterSpacing: '0.25em' }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[11px] sm:text-xs md:text-sm font-semibold text-white/80 uppercase tracking-[0.25em] mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            SEVEN B • {slide.category}
          </motion.div>
        )}

        {/* Main Title — Refined luxury size (not oversized so the photo shines) */}
        {slide.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] leading-tight mb-2 max-w-4xl"
          >
            {slide.title}
          </motion.h1>
        )}

        {/* Description / Message — Concise and elegant */}
        {slide.description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.75 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-light max-w-3xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] tracking-wide"
          >
            {slide.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
