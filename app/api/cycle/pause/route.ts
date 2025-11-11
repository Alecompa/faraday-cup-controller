import { NextResponse } from 'next/server';
import { pauseCycleProgram } from '@/lib/cycle-scheduler';

export async function POST() {
  try {
    const result = pauseCycleProgram();
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

