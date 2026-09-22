import { NextResponse } from 'next/server';
import { resetToOfficialSequence } from '@/lib/slideStore';

export async function POST() {
  try {
    const slides = await resetToOfficialSequence();
    return NextResponse.json({ 
      success: true, 
      message: 'Réinitialisé à la séquence officielle stricte (Devanture, Jacuzzi, Salons, Dîner, Chambres, Fractionné, Événements)', 
      slides 
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
