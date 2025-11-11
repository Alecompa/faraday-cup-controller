import { NextResponse } from 'next/server';
import { pollRelayState } from '@/lib/faraday-controller';

// Manual endpoint to poll the relay state
export async function GET() {
  try {
    const result = await pollRelayState();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        state: result.state 
      });
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

