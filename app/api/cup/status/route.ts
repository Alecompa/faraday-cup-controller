import { NextResponse } from 'next/server';
import { getState } from '@/lib/state';
import { getCycleStatus } from '@/lib/cycle-scheduler';

export async function GET() {
  try {
    const state = getState();
    const cycleStatus = getCycleStatus();
    
    return NextResponse.json({
      currentState: state.currentState,
      lastCommand: state.lastCommand,
      lastCommandTime: state.lastCommandTime,
      cycleExecution: cycleStatus,
      history: state.history.slice(-10), // Last 10 entries
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

