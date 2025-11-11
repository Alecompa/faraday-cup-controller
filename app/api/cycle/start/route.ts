import { NextResponse } from 'next/server';
import { startCycleProgram } from '@/lib/cycle-scheduler';
import { CycleProgram } from '@/lib/state';

export async function POST(request: Request) {
  try {
    const program: CycleProgram = await request.json();
    
    // Validate program
    if (!program.steps || program.steps.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Program must have at least one step' },
        { status: 400 }
      );
    }
    
    const result = startCycleProgram(program);
    
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

