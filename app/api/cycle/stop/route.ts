import { NextResponse } from 'next/server';
import { stopCycleProgram } from '@/lib/cycle-scheduler';

export async function POST() {
  try {
    stopCycleProgram();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

