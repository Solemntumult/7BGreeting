"use client";

import { useState, useEffect, useRef } from 'react';
import { SlideData } from '@/data/curatedSequence';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PhotoSlide from './templates/PhotoSlide';
import AnnouncementSlide from './templates/AnnouncementSlide';
import FractionneSlide from './templates/FractionneSlide';
import MapSlide from './templates/MapSlide';
import { Maximize2, Settings } from 'lucide-react';
import Link from 'next/link';

interface SlideshowProps {
  initialSlides?: SlideData[];
}

export default function Slideshow({ initialSlides = [] }: SlideshowProps) {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const cursorTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync active slides from API on mount & poll every 25s for live updates
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/slides?active=true');
        const data = await res.json();
        if (data.success && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlides(data.slides);
        }
      } catch (err) {
        console.error('Error syncing slides:', err);
      }
    };

    fetchSlides();
    const interval = setInterval(fetchSlides, 25000);
    return () => clearInterval(interval);
  }, []);

  // Slide cycle timer (7s default per slide)
  useEffect(() => {
    if (slides.length === 0) return;

    const currentSlide = slides[currentIndex % slides.length];
    const duration = currentSlide?.duration || 7000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  // Hide cursor on TV screen after 3.5 seconds of inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setCursorVisible(true);
      setShowControls(true);
      if (cursorTimer.current) clearTimeout(cursorTimer.current);
      cursorTimer.current = setTimeout(() => {
        setCursorVisible(false);
        setShowControls(false);
      }, 3500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (cursorTimer.current) clearTimeout(cursorTimer.current);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (slides.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center p-8">
        <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mb-4" />
        <div className="text-2xl font-bold tracking-wide">Initialisation Seven B TV Signage...</div>
        <div className="text-sm text-white/60 mt-2">Chargement du flux d'affichage</div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex % slides.length];

  return (
    <div 
      className={`w-full h-full relative overflow-hidden bg-black select-none ${
        cursorVisible ? 'cursor-default' : 'cursor-none'
      }`}
      onDoubleClick={toggleFullscreen}
    >
      <AnimatePresence mode="wait">
        {currentSlide.type === 'fractionne' ? (
          <FractionneSlide key={currentSlide.id} slide={currentSlide} />
        ) : currentSlide.type === 'map' ? (
          <MapSlide key={currentSlide.id} slide={currentSlide} />
        ) : currentSlide.type === 'photo' ? (
          <PhotoSlide key={currentSlide.id} slide={currentSlide} />
        ) : (
          <AnnouncementSlide key={currentSlide.id} slide={currentSlide} />
        )}
      </AnimatePresence>

      {/* Permanent Rotating Seven B Logo in Top-Right Corner */}
      <div className="absolute top-6 right-8 z-40 pointer-events-none flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="relative w-16 h-16 md:w-20 md:h-20 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] filter"
        >
          <Image
            src="/sevenblogo.svg"
            alt="Logo Seven B"
            fill
            className="object-contain"
            priority
          />
        </motion.div>
      </div>

      {/* Discrete bottom corner controls (only visible on mouse move) */}
      <div 
        className={`absolute bottom-5 right-6 z-40 flex items-center gap-2 transition-opacity duration-300 ${
          showControls ? 'opacity-80' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-black/60 backdrop-blur border border-white/20 text-white hover:bg-black/90 cursor-pointer"
          title="Plein écran (Double-clic)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur text-white font-bold text-xs shadow-lg cursor-pointer"
          title="Panneau de configuration"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Gestion Admin</span>
        </Link>
      </div>
    </div>
  );
}
