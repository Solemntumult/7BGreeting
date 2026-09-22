import Image from 'next/image';
import { Slide } from '@/data/slides';
import { motion } from 'framer-motion';

interface AnnouncementSlideProps {
  slide: Slide;
}

export default function AnnouncementSlide({ slide }: AnnouncementSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="relative w-full h-full flex"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.imageUrl}
          alt={slide.title || 'Announcement Background'}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay for text readability */}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-16 lg:px-32">
        {slide.title && (
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-wide drop-shadow-lg"
          >
            {slide.title}
          </motion.h1>
        )}
        
        {slide.description && (
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-2xl md:text-4xl lg:text-5xl text-gray-200 max-w-5xl leading-relaxed drop-shadow-md"
          >
            {slide.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
