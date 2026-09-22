import fs from 'fs';
import path from 'path';
import { OFFICIAL_SEQUENCE, SlideData, SlideType, Slide } from '@/data/curatedSequence';
import { prisma } from './prisma';

export type { SlideData, SlideType, Slide };

const DATA_FILE = path.join(process.cwd(), 'data', 'slides_store.json');

// Memory cache of slides
let inMemorySlides: SlideData[] = [...OFFICIAL_SEQUENCE];

export async function getSlidesFromDb(): Promise<SlideData[]> {
  try {
    // Attempt to query PostgreSQL
    const dbSlides = await prisma.slide.findMany({
      orderBy: { order: 'asc' }
    });

    if (dbSlides && dbSlides.length > 0) {
      return dbSlides.map(s => ({
        id: s.id,
        type: s.type as SlideType,
        imageUrl: s.imageUrl,
        title: s.title || undefined,
        description: s.description || undefined,
        duration: s.duration,
        category: s.category || undefined,
        active: s.active,
        order: s.order,
        metadata: s.metadata ? JSON.parse(s.metadata) : undefined
      }));
    } else {
      // If table is empty, seed with OFFICIAL_SEQUENCE in PostgreSQL
      await seedPostgresWithOfficial();
      return [...OFFICIAL_SEQUENCE];
    }
  } catch (err) {
    // Graceful fallback to local persistent store if PostgreSQL is offline
    return getSlidesFromFile();
  }
}

async function seedPostgresWithOfficial() {
  try {
    for (const slide of OFFICIAL_SEQUENCE) {
      await prisma.slide.upsert({
        where: { id: slide.id },
        update: {},
        create: {
          id: slide.id,
          type: slide.type as any,
          imageUrl: slide.imageUrl,
          title: slide.title || null,
          description: slide.description || null,
          duration: slide.duration || 5500,
          category: slide.category || null,
          active: slide.active !== false,
          order: slide.order || 0,
          metadata: slide.metadata ? JSON.stringify(slide.metadata) : null
        }
      });
    }
  } catch (err) {
    console.warn('PostgreSQL not reachable for seeding, using file store');
  }
}

export function getSlidesFromFile(): SlideData[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading slides file:', err);
  }
  // Initialize file
  saveSlidesToFile(OFFICIAL_SEQUENCE);
  return [...OFFICIAL_SEQUENCE];
}

export function saveSlidesToFile(slides: SlideData[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(slides, null, 2), 'utf-8');
    inMemorySlides = [...slides];
    return true;
  } catch (err) {
    console.error('Error saving slides file:', err);
    return false;
  }
}

export async function saveSlideToDb(slide: SlideData): Promise<boolean> {
  // Always save to file/memory
  const current = getSlidesFromFile();
  const idx = current.findIndex(s => s.id === slide.id);
  if (idx >= 0) {
    current[idx] = slide;
  } else {
    current.push(slide);
  }
  saveSlidesToFile(current);

  // Also sync to PostgreSQL if connected
  try {
    await prisma.slide.upsert({
      where: { id: slide.id },
      update: {
        type: slide.type as any,
        imageUrl: slide.imageUrl,
        title: slide.title || null,
        description: slide.description || null,
        duration: slide.duration || 5500,
        category: slide.category || null,
        active: slide.active !== false,
        order: slide.order || 0,
        metadata: slide.metadata ? JSON.stringify(slide.metadata) : null
      },
      create: {
        id: slide.id,
        type: slide.type as any,
        imageUrl: slide.imageUrl,
        title: slide.title || null,
        description: slide.description || null,
        duration: slide.duration || 5500,
        category: slide.category || null,
        active: slide.active !== false,
        order: slide.order || 0,
        metadata: slide.metadata ? JSON.stringify(slide.metadata) : null
      }
    });
    return true;
  } catch (err) {
    return true; // file store succeeded
  }
}

export async function deleteSlideFromDb(id: string): Promise<boolean> {
  const current = getSlidesFromFile().filter(s => s.id !== id);
  current.forEach((s, idx) => s.order = idx + 1);
  saveSlidesToFile(current);

  try {
    await prisma.slide.delete({ where: { id } });
  } catch (err) {
    // Ignore if not in DB
  }
  return true;
}

export async function resetToOfficialSequence(): Promise<SlideData[]> {
  saveSlidesToFile(OFFICIAL_SEQUENCE);
  try {
    await prisma.slide.deleteMany({});
    await seedPostgresWithOfficial();
  } catch (err) {
    console.warn('PostgreSQL reset skipped (db offline)');
  }
  return [...OFFICIAL_SEQUENCE];
}

export interface AvailablePhoto {
  filename: string;
  url: string;
  category: string;
  label: string;
}

export function getAvailablePhotos(): AvailablePhoto[] {
  const list: AvailablePhoto[] = [];
  const tvFolder = path.join(process.cwd(), 'public', 'selection_photos_tv');
  const uploadsFolder = path.join(process.cwd(), 'public', 'uploads');

  if (fs.existsSync(tvFolder)) {
    const files = fs.readdirSync(tvFolder);
    for (const f of files) {
      if (f.match(/\.(jpg|jpeg|png|webp)$/i)) {
        let label = f.replace(/^[0-9]+_/, '').replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/_/g, ' ');
        label = label.charAt(0).toUpperCase() + label.slice(1);
        list.push({
          filename: f,
          url: `/selection_photos_tv/${f}`,
          category: 'Collection Officielle Seven B',
          label
        });
      }
    }
  }

  if (fs.existsSync(uploadsFolder)) {
    const files = fs.readdirSync(uploadsFolder);
    for (const f of files) {
      if (f.match(/\.(jpg|jpeg|png|webp)$/i)) {
        list.push({
          filename: f,
          url: `/uploads/${f}`,
          category: 'Photos Importées',
          label: f.replace(/\.(jpg|jpeg|png|webp)$/i, '')
        });
      }
    }
  }

  return list;
}
