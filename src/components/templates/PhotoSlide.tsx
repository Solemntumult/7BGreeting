"use client";

import Image from 'next/image';
import { SlideData } from '@/data/curatedSequence';
import { motion } from 'framer-motion';

interface PhotoSlideProps {
  slide: SlideData;
}

export default function PhotoSlide({ slide }: PhotoSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeInOut' }}
      className="relative w-full h-full overflow-hidden bg-black select-none"
    >
      {/* Background Image with Slow Cinematic Zoom */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={slide.imageUrl}
          alt={slide.title || 'Seven B Image'}
          fill
          className="object-cover"
          priority
        />
        {/* Soft bottom vignette to guarantee text legibility without box */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
      </motion.div>

      {/* Discreet bottom overlay — Pure White Text, NO BOX */}
      {slide.title && (
        <div className="absolute bottom-12 left-14 z-10 max-w-3xl pointer-events-none">
          {slide.category && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs sm:text-sm font-bold text-white uppercase tracking-[0.25em] mb-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              Seven B • {slide.category}
            </motion.div>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
          >
            {slide.title}
          </motion.h2>
          {slide.description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7 }}
              className="text-base sm:text-xl text-white/90 font-light mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-2xl"
            >
              {slide.description}
            </motion.p>
          )}
        </div>
      )}
    </motion.div>
  );
}
