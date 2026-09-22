import Image from 'next/image';
import { Slide } from '@/data/slides';
import { motion } from 'framer-motion';

interface PhotoSlideProps {
  slide: Slide;
}

export default function PhotoSlide({ slide }: PhotoSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      className="relative w-full h-full"
    >
      <Image
        src={slide.imageUrl}
        alt={slide.title || 'Hotel Slide'}
        fill
        className="object-cover"
        priority
      />
    </motion.div>
  );
}
