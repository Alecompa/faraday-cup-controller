import { NextResponse } from 'next/server';
import { openCup } from '@/lib/faraday-controller';

export async function POST() {
  try {
    const result = await openCup();
    
    if (result.success) {
      return NextResponse.json({ success: true, state: 'open' });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

