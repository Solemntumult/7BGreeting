import { NextResponse } from 'next/server';
import { getAvailablePhotos } from '@/lib/slideStore';

export async function GET() {
  try {
    const photos = getAvailablePhotos();
    return NextResponse.json({ success: true, photos });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
