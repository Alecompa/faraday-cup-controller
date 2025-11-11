import { NextResponse } from 'next/server';
import { isDebugMode } from '@/lib/faraday-controller';

export async function GET() {
  return NextResponse.json({
    debugMode: isDebugMode(),
    deviceUrl: process.env.DEVICE_URL || 'http://192.168.0.30',
  });
}

