import { NextResponse } from 'next/server';
import { initializeState, startStatePolling } from '@/lib/faraday-controller';

// This endpoint initializes the relay state when called
export async function POST() {
  try {
    await initializeState();
    startStatePolling(10000); // Poll every 10 seconds
    
    return NextResponse.json({ 
      success: true,
      message: 'State initialized and polling started'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

