import { NextResponse } from 'next/server';
import { checkAIAvailability } from '@/lib/gemma4';

export const dynamic = 'force-dynamic';

export async function GET() {
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
