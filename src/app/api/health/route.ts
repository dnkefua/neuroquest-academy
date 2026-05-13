import { NextResponse } from 'next/server';
import { checkAIAvailability } from '@/lib/gemma4';

export async function GET() {
  if (process.env.NEXT_OUTPUT === 'static') {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      aiProvider: 'static-mobile',
      aiAvailable: false,
      aiLatency: 0,
      demoMode: true,
    });
  }

  const aiStatus = await checkAIAvailability();
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiProvider: aiStatus.provider,
    aiAvailable: aiStatus.available,
    aiLatency: aiStatus.latency,
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  });
}
