import { NextResponse } from 'next/server';
import { resumeCycleProgram, getCycleStatus } from '@/lib/cycle-scheduler';
import { CycleProgram } from '@/lib/state';

export async function POST(request: Request) {
  try {
    const program: CycleProgram = await request.json();
    
    const result = resumeCycleProgram(program);
    
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

