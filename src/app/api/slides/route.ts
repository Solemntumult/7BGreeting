import { NextResponse } from 'next/server';
import { 
  getSlidesFromDb, 
  saveSlideToDb, 
  deleteSlideFromDb, 
  saveSlidesToFile, 
  SlideData 
} from '@/lib/slideStore';

// GET /api/slides - returns list of slides
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActive = searchParams.get('active') === 'true';

  let slides = await getSlidesFromDb();
  if (onlyActive) {
    slides = slides.filter(s => s.active !== false);
  }
  slides.sort((a, b) => (a.order || 0) - (b.order || 0));

  return NextResponse.json({ success: true, slides });
}

// POST /api/slides - create a new slide
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, imageUrl, title, description, duration, category, metadata } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Une image est requise' }, { status: 400 });
    }

    const current = await getSlidesFromDb();
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      type: type || 'announcement',
      imageUrl,
      title: title || '',
      description: description || '',
      duration: Number(duration) || 6000,
      category: category || 'Annonce',
      active: true,
      order: current.length + 1,
      metadata: metadata || undefined
    };

    await saveSlideToDb(newSlide);
    const updated = await getSlidesFromDb();

    return NextResponse.json({ success: true, slide: newSlide, slides: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/slides - update or batch reorder
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Batch reorder update
    if (Array.isArray(body.slides)) {
      saveSlidesToFile(body.slides);
      for (const s of body.slides) {
        await saveSlideToDb(s);
      }
      return NextResponse.json({ success: true, slides: body.slides });
    }

    // Single slide update
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    }

    const current = await getSlidesFromDb();
    const existing = current.find(s => s.id === id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Diapositive introuvable' }, { status: 404 });
    }

    const updatedSlide: SlideData = { ...existing, ...updates };
    await saveSlideToDb(updatedSlide);
    const updated = await getSlidesFromDb();

    return NextResponse.json({ success: true, slide: updatedSlide, slides: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/slides?id=... - delete slide
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requis' }, { status: 400 });
    }

    await deleteSlideFromDb(id);
    const updated = await getSlidesFromDb();

    return NextResponse.json({ success: true, slides: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
