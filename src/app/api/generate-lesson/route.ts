import { NextRequest, NextResponse } from 'next/server';
import { getIBContext } from '@/lib/ib-curriculum';
import { GenerateLessonSchema } from '@/lib/schemas';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { generateLesson } from '@/lib/gemma4';
import type { StudentClass } from '@/types';

// Cache for generated lessons
const lessonCache = new Map<string, { lesson: object; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// Narrator personalities
const NARRATORS: Record<StudentClass, { name: string; gender: 'male' | 'female'; tagline: string; voiceLang: string }> = {
  math:     { name: 'Professor Quasar',   gender: 'male',   tagline: 'Equation Wizard Extraordinaire',   voiceLang: 'en-US' },
  science:  { name: 'Dr. Nova',           gender: 'female', tagline: 'Discovery Guide Extraordinaire', voiceLang: 'en-US' },
  english:  { name: 'Scribe Avalon',      gender: 'male',   tagline: 'Word Magic Maestro',             voiceLang: 'en-US' },
  arabic:   { name: 'Sheikh Tariq',       gender: 'male',   tagline: 'Memory Temple Keeper',         voiceLang: 'ar-SA' },
};

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = getClientIP(req);
  const { allowed, resetAt } = rateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before trying again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) } }
    );
  }

  // Input validation
  const body = await req.json();
  const parsed = GenerateLessonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { subject, grade, language, studentName, emotion, difficulty } = parsed.data;
  const numGrade = typeof grade === 'string' ? parseInt(grade, 10) : grade;
  const studentClass: StudentClass = (subject as StudentClass) || 'math';
  const narrator = NARRATORS[studentClass];

  // Check cache
  const cacheKey = `${subject}_g${numGrade}_${difficulty}_${language}`;
  const cached = lessonCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json({ lesson: cached.lesson, cached: true, narrator });
  }

  try {
    // Generate lesson with Gemma4 AI
    const lesson = await generateLesson({
      subject,
      grade: numGrade,
      topic: subject, // This would normally come from the request
      language: language as 'EN' | 'AR',
      studentName: studentName ?? 'Explorer',
      difficulty: difficulty ?? 'medium',
      emotion: emotion,
      studentClass,
    });

    // Enhance with IB context
    const ibCtx = getIBContext(subject, numGrade);
    
    // Add narrator info to lesson
    const enhancedLesson = {
      ...lesson,
      narrator,
      ibContext: ibCtx,
      generatedAt: new Date().toISOString(),
    };

    // Cache and return
    lessonCache.set(cacheKey, { lesson: enhancedLesson, ts: Date.now() });
    return NextResponse.json({ lesson: enhancedLesson });

  } catch (err) {
    console.error('[generate-lesson] Error:', err);
    return NextResponse.json(
      { error: 'Failed to generate lesson. Please try again.' },
      { status: 500 }
    );
  }
}
