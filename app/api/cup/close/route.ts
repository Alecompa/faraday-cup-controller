import { NextResponse } from 'next/server';
import { closeCup } from '@/lib/faraday-controller';

export async function POST() {
  try {
    const result = await closeCup();
    
    if (result.success) {
      return NextResponse.json({ success: true, state: 'closed' });
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

