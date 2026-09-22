import Slideshow from '@/components/Slideshow';
import { OFFICIAL_SEQUENCE } from '@/data/curatedSequence';

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-black text-white">
      <Slideshow initialSlides={OFFICIAL_SEQUENCE} />
    </main>
  );
}
