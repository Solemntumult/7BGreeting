"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SlideData } from '@/data/curatedSequence';

interface FractionneSlideProps {
  slide: SlideData;
}

export default function FractionneSlide({ slide }: FractionneSlideProps) {
  const panels = slide.metadata?.panels || [
    { title: 'Devanture', imageUrl: '/selection_photos_tv/01_facade_devanture_seven_b.webp', tag: 'Accueil' },
    { title: 'Réception', imageUrl: '/selection_photos_tv/02_reception_accueil_prestige.webp', tag: 'Service 24h' },
    { title: 'Salons', imageUrl: '/selection_photos_tv/salon_image005_hd.webp', tag: 'Séjour' },
    { title: 'Espace Dîner', imageUrl: '/selection_photos_tv/espace_diner_image011.webp', tag: 'Repas' },
    { title: 'Chambres', imageUrl: '/selection_photos_tv/chambre_lit_prestige.webp', tag: 'Nuits' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between"
    >
      {/* Dynamic Animated Panels Grid */}
      <div className="absolute inset-0 grid grid-cols-5 gap-1.5 p-1.5 z-0 bg-black">
        {panels.map((panel, idx) => {
          // Staggered panel reveal direction: alternating from top / bottom
          const fromTop = idx % 2 === 0;
          return (
            <motion.div
              key={panel.imageUrl + idx}
              initial={{ y: fromTop ? -100 : 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.12, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full overflow-hidden rounded-lg group"
            >
              {/* Continuous subtle Ken Burns pan */}
              <motion.div
                animate={{ scale: [1, 1.12, 1.05] }}
                transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="relative w-full h-full"
              >
                <Image
                  src={panel.imageUrl}
                  alt={panel.title}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              {/* Dark subtle vignette over panels to keep focus and enhance contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60" />

              {/* Individual vertical panel label (Pure white text, no box) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                className="absolute bottom-6 inset-x-0 text-center px-2 z-10 pointer-events-none"
              >
                <div className="text-[11px] font-semibold tracking-[0.2em] text-white/70 uppercase">
                  {panel.tag}
                </div>
                <div className="text-sm md:text-base font-bold text-white tracking-wide mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {panel.title}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Center Cinematic Overlay — Pure White Text, NO BOX */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-8 pointer-events-none">
        {/* Subtle radial ambient dark veil behind text for perfect legibility without rectangle box */}
        <div className="absolute inset-0 bg-radial from-black/60 via-black/20 to-transparent pointer-events-none" />

        <div className="relative z-20 flex flex-col items-center max-w-5xl">
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, letterSpacing: '0.4em', y: -15 }}
            animate={{ opacity: 0.9, letterSpacing: '0.25em', y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-[11px] sm:text-xs md:text-sm text-white/80 font-semibold uppercase tracking-[0.25em] mb-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            L'EXPÉRIENCE SEVEN B GUEST HOUSE
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] leading-tight max-w-4xl"
          >
            {slide.title || 'Seven B Guest House'}
          </motion.h1>

          {/* Description line */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-light max-w-3xl mt-3 tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-relaxed"
          >
            {slide.description || 'Chaque espace a été conçu pour sublimer votre séjour'}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
