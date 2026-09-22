"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SlideData } from '@/data/curatedSequence';

interface MapSlideProps {
  slide: SlideData;
}

export default function MapSlide({ slide }: MapSlideProps) {
  // Pin coordinate percentages from carte.svg (1917 x 735)
  // X = 915.115 / 1917 = 47.737%
  // Y = 454.72 / 735 = 61.867%
  const pinLeft = '47.737%';
  const pinTop = '61.867%';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="relative w-full h-full bg-[#0B0F17] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Background Map Container with subtle cinematic drift */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.02 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="relative w-full h-full"
        >
          <Image
            src={slide.imageUrl || '/selection_photos_tv/carte_bg.svg'}
            alt="Carte Seven B"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Subtle cinematic gradient overlays for depth (pure darkening, no box) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/60 pointer-events-none" />
        </motion.div>
      </div>

      {/* TOP TEXT — Pure White Typography, Absolutely NO BOX */}
      <div className="relative z-20 w-full pt-12 sm:pt-16 text-center flex flex-col items-center pointer-events-none px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -20, letterSpacing: '0.4em' }}
          animate={{ opacity: 0.9, y: 0, letterSpacing: '0.3em' }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs sm:text-sm font-bold text-white uppercase tracking-[0.3em] mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          SEVEN B HÔTEL • LOCALISATION
        </motion.div>

        {/* Main Title Requested: "Où sommes-nous" */}
        <motion.h1
          initial={{ opacity: 0, y: 25, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)] leading-tight"
        >
          {slide.title || 'Où sommes-nous ?'}
        </motion.h1>

        {/* Subtitle Address */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="text-lg sm:text-2xl md:text-3xl text-white/95 font-light max-w-4xl mt-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] tracking-wide"
        >
          {slide.description || 'Maison Claude LISSANON, Rue 12578, Akogbato — Cotonou, Bénin'}
        </motion.p>
      </div>

      {/* DYNAMIC ANIMATED RED ANCHOR PIN (Positioned directly on exact coordinates) */}
      <div 
        className="absolute z-30 pointer-events-none"
        style={{ left: pinLeft, top: pinTop }}
      >
        {/* Pulsating Radar Rings emerging from the anchor tip */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2">
          {/* Pulse Ring 1 */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 3.5, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            className="w-16 h-16 rounded-full border-2 border-red-500"
          />
          {/* Pulse Ring 2 */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.8 }}
            animate={{ scale: 4.8, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 0.7 }}
            className="absolute inset-0 w-16 h-16 rounded-full border-2 border-red-400"
          />
          {/* Pulse Ring 3 */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0.6 }}
            animate={{ scale: 6.0, opacity: 0 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1.4 }}
            className="absolute inset-0 w-16 h-16 rounded-full border border-red-300"
          />
        </div>

        {/* The Enlarged Red Pin (Drops from above with spring bounce) */}
        <motion.div
          initial={{ y: -260, opacity: 0, scale: 0.5 }}
          animate={{ y: -64, opacity: 1, scale: 1.4 }}
          transition={{ 
            delay: 0.7, 
            type: 'spring', 
            stiffness: 260, 
            damping: 14 
          }}
          className="relative -left-6 flex flex-col items-center"
        >
          {/* Enlarged SVG Pin Icon with glowing drop shadow */}
          <svg
            width="48"
            height="64"
            viewBox="0 0 40 54"
            fill="none"
            className="drop-shadow-[0_8px_20px_rgba(255,46,71,0.8)] filter"
          >
            <path
              d="M20 0C8.954 0 0 8.954 0 20C0 35 20 54 20 54C20 54 40 35 40 20C40 8.954 31.046 0 20 0Z"
              fill="#FF2E47"
            />
            {/* White Center Ring / Dot */}
            <circle cx="20" cy="20" r="7" fill="white" />
            <circle cx="20" cy="20" r="3.5" fill="#FF2E47" />
          </svg>

          {/* Floating Pure White Hotel Label above the pin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute -top-10 whitespace-nowrap text-center"
          >
            <div className="text-sm font-black text-white tracking-wider uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Guest House Seven B
            </div>
            <div className="text-[11px] font-semibold text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              Akogbato • Cotonou
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Footer Info — Pure White, No Box */}
      <div className="relative z-20 w-full pb-8 sm:pb-12 text-center pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="text-xs sm:text-sm tracking-widest text-white/80 uppercase font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
        >
          À 5 minutes de l'Aéroport International & des Plages de Fidjrossè
        </motion.p>
      </div>
    </motion.div>
  );
}
