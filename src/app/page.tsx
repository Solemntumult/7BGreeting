import Slideshow from '@/components/Slideshow';
import { slides } from '@/data/slides';

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-black text-white">
      <Slideshow slides={slides} />
    </main>
  );
}
