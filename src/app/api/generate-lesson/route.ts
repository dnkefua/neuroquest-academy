import { NextRequest, NextResponse } from 'next/server';
import { getIBContext } from '@/lib/ib-curriculum';
import { GenerateLessonSchema } from '@/lib/schemas';
import { rateLimit, getClientIP } from '@/lib/rateLimit';
import { generateWithFallback } from '@/lib/vertexAI';
import type { StudentClass } from '@/types';

// ── Narrator personalities per class (OpenMAIC class narrator concept) ──────────
const NARRATORS: Record<StudentClass, { name: string; gender: 'male' | 'female'; tagline: string; voiceLang: string }> = {
  math:     { name: 'Professor Quasar',   gender: 'male',   tagline: 'Equation Wizard Extraordinaire',   voiceLang: 'en-US' },
  science:  { name: 'Dr. Nova',           gender: 'female', tagline: 'Discovery Guide Extraordinaire', voiceLang: 'en-US' },
  english:  { name: 'Scribe Avalon',      gender: 'male',   tagline: 'Word Magic Maestro',             voiceLang: 'en-US' },
  arabic:   { name: 'Sheikh Tariq',       gender: 'male',   tagline: 'Memory Temple Keeper',         voiceLang: 'ar-SA' },
};

// ── In-memory cache (24h TTL) ───────────────────────────────────────────────────
const lessonCache = new Map<string, { lesson: object; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// ── Emotion-aware tone adjustment ──────────────────────────────────────────────
function emotionTone(emotion: string | undefined): string {
  return {
    frustrated: 'Use very short sentences, lots of emojis, celebrate every small win. Start with the easiest possible idea. Be extra encouraging.',
    anxious:    'Use an extra calm, warm tone. Reassure often ("You\'ve got this!"). Start with something they definitely know.',
    happy:     'Be upbeat and energised! Include a surprising "Did you know?" fun fact.',
    neutral:   'Be warm, curious, and engaging. Make the content feel like an adventure.',
  }[emotion ?? 'neutral'] ?? 'Be warm and clear.';
}

// ── Difficulty context ─────────────────────────────────────────────────────────
function difficultyCtx(difficulty: string): string {
  return {
    easy:   'Use very simple examples. Recall questions only. One concept per section.',
    medium: 'Include one multi-step problem. Mix recall and application questions.',
    hard:   'Include exam-style questions. Require multi-step reasoning. Add extension challenges.',
  }[difficulty] ?? 'Medium difficulty. Mix recall and application.';
}

// ── Build OpenMAIC-style lesson prompt ─────────────────────────────────────────
function buildLessonPrompt(params: {
  subject: string;
  grade: number;
  language: string;
  studentName: string;
  emotion?: string;
  difficulty: string;
  ibCtx: ReturnType<typeof getIBContext>;
  studentClass: StudentClass;
}): string {
  const { subject, grade, language, studentName, emotion, difficulty, ibCtx, studentClass } = params;
  const narrator = NARRATORS[studentClass];
  const emotionCtx = emotionTone(emotion);
  const diffCtx = difficultyCtx(difficulty);
  const isArabic = language === 'AR' || language === 'ar';
  const lang = isArabic ? 'Arabic (Modern Standard Arabic with Gulf-friendly expressions)' : 'English';

  const ibSection = ibCtx ? `
IB CURRICULUM CONTEXT (always include this):
- Framework: ${ibCtx.framework}
- Unit: "${ibCtx.unit}"
- Specific Topics: ${ibCtx.topics.join(', ')}
- Prior Knowledge: ${ibCtx.priorKnowledge}
${ibCtx.sampleProblems?.length ? `- Sample IB-style problems: ${ibCtx.sampleProblems.join(' | ')}` : ''}
- IB Topic Key: "${ibCtx.ibTopicKey}"
` : `- Subject: ${subject}\n- IB Topic Key: "${subject}-g${grade}"`;

  return `You are an IB-certified neurodiverse educator specialising in ${studentClass === 'math' ? 'mathematics and logical problem-solving' : studentClass === 'science' ? 'science and natural inquiry' : studentClass === 'english' ? 'English language and literacy' : 'Arabic language and cultural studies'} for students aged 6-18 in Dubai, UAE.

CLASS NARRATOR: You are ${narrator.name} (${narrator.tagline}). You speak in a warm, immersive storytelling style that makes every concept feel like an adventure. You use the student's name "${studentName || 'there'}" naturally throughout.

${ibSection}

STUDENT PROFILE:
- Name: ${studentName || 'the student'}
- Grade: ${grade} (${grade <= 5 ? 'PYP' : grade <= 10 ? 'MYP' : 'DP'} programme)
- Language: ${lang}
- Emotion state: ${emotion ?? 'neutral'}. ${emotionCtx}
- Difficulty: ${difficulty}. ${diffCtx}

YOUR TASK: Generate a complete, curriculum-accurate lesson. Follow the OpenMAIC "slides are visual aids, NOT scripts" philosophy.

## OUTPUT FORMAT
Return ONLY valid JSON (no markdown, no backticks). Structure:

{
  "title": "IB unit name with emoji hook",
  "intro": "Warm 2-3 sentence welcome using student name and the IB topic",
  "ibTopicKey": "exact ibTopicKey from curriculum above",
  "narrator": { "name": "${narrator.name}", "class": "${studentClass}", "gender": "${narrator.gender}", "tagline": "${narrator.tagline}" },
  "sections": [
    {
      "type": "slide|demonstration|interactive|narrated",
      "heading": "Section heading with emoji",
      "content": "Concise slide content — keywords, phrases, bullet points (under 20 words per item). NO full sentences written in a conversational tone. NO paragraphs.",
      "visualType": "number-line|diagram|chart|animation|interactive-html|real-world",
      "keyPoints": ["bullet 1", "bullet 2", "bullet 3"],
      "workedExample": "Step-by-step worked example for maths (only for math class, omit otherwise)",
      "realWorldExample": "UAE/Dubai context example (souq, Burj Khalifa, desert, mosque, palm trees, etc.)",
      "activity": "Concrete hands-on or pencil-and-paper activity student can do RIGHT NOW",
      "narrationScript": "EXACT words ${narrator.name} should SAY aloud when presenting this section. Be conversational, warm, personal. Use student name. 2-4 sentences max."
    }
  ],
  "quiz": [
    {
      "question": "IB-style question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Clear explanation why the answer is correct",
      "workedExample": "Step-by-step solution shown after wrong answer",
      "difficulty": "easy|medium|hard"
    }
  ],
  "encouragement": "Personalised closing message using student name and what they learned",
  "brainBreakTip": "Subject-relevant sensory or movement tip"
}

RULES:
- EXACTLY 4 sections (WARMUP, CONCEPT, PRACTICE, DEEPEN), EXACTLY 3 quiz questions
- Math lessons: include workedExample in EVERY section and quiz question
- "slides are visual aids NOT scripts" — keep slide content CONCISE, put detailed explanations in narrationScript
- NEVER attribute advice to the narrator by name in slide content — use neutral labels ("Tip", "Note", "Remember")
- ${isArabic ? 'Write ALL text in Arabic (Modern Standard Arabic with Gulf-friendly expressions)' : 'Write in clear English suitable for IB grade ' + grade}
- Autism-friendly: clear structure, no idioms, predictable format, no sarcasm
- Reference UAE/Dubai context naturally: souq prices, Burj Khalifa, desert temperatures, mosque architecture, palm trees, Arabian Gulf
- quiz.correct is the INDEX of the correct option (0-3)
- Output valid JSON only — no explanations, no markdown code fences, no trailing text`;
}

// ── Fallback lesson (no AI needed) ──────────────────────────────────────────
function buildFallback(
  subject: string,
  grade: number,
  studentName: string,
  ibCtx: ReturnType<typeof getIBContext>,
  studentClass: StudentClass
) {
  const narrator = NARRATORS[studentClass];
  const name = studentName || 'there';
  const unit = ibCtx?.unit ?? subject;
  const topics = ibCtx?.topics ?? [];
  const samples = ibCtx?.sampleProblems ?? [];

  return {
    title: `📖 ${ibCtx?.framework ?? 'IB'}: ${unit}`,
    intro: `Hey ${name}! 👋 Welcome to ${unit}. I'm ${narrator.name}, and today we're going on an adventure through ${unit}!`,
    ibTopicKey: ibCtx?.ibTopicKey ?? `${studentClass}-g${grade}`,
    narrator: { name: narrator.name, class: studentClass, gender: narrator.gender, tagline: narrator.tagline },
    sections: [
      {
        type: 'demonstration', heading: `🌟 What is ${unit}?`, content: `In this unit we focus on ${topics[0] ?? unit}. Let's explore it together!`,
        visualType: 'diagram', keyPoints: [`Focus on ${topics[0] ?? unit}`, 'Build on what you already know', 'Ask questions anytime'],
        workedExample: topics[0] ? `Example: Let's solve a problem about ${topics[0]}` : undefined,
        realWorldExample: 'UAE example: counting coins at a Dubai souq',
        activity: `Think of one real-world example of "${topics[1] ?? unit}" you saw this week`,
        narrationScript: `Great to have you here, ${name}! I'm ${narrator.name}. Today we're diving into ${unit}. This is going to be fun — let's get started!`,
      },
      {
        type: 'interactive', heading: '💡 Key Concepts', content: topics.slice(0, 3).join(' • ') || 'Key ideas in this unit build on each other step by step.',
        visualType: 'chart', keyPoints: ['Concept 1', 'Concept 2', 'Concept 3'],
        workedExample: samples[0] ? `Try: ${samples[0]}` : undefined,
        realWorldExample: 'UAE context: measuring in a mosque architecture project',
        activity: 'Explain this concept in your own words to a friend or family member',
        narrationScript: `Now let's look at the key ideas. These are like tools in your adventure toolkit — the more you use them, the stronger they get!`,
      },
      {
        type: 'slide', heading: '🎯 Putting It Into Practice', content: 'Apply what you learned in unfamiliar contexts.',
        visualType: 'real-world', keyPoints: ['Try it yourself', 'Mistakes are how your brain grows', 'Keep going!'],
        workedExample: samples[1] ? `Challenge: ${samples[1]}` : undefined,
        realWorldExample: 'UAE: planning a trip to the desert and calculating distances',
        activity: 'Create your own example problem and solve it!',
        narrationScript: `You've got this, ${name}! Applying knowledge is the real superpower. Don't worry about mistakes — every expert was once a beginner!`,
      },
      {
        type: 'narrated', heading: '📚 Deepen Your Understanding', content: 'Review and connect the key ideas.',
        visualType: 'animation', keyPoints: ['Review the main idea', 'Connect to what you know', 'You are capable!'],
        realWorldExample: 'UAE: how maths/science/language connects to Dubai\'s amazing buildings and technology',
        activity: 'Draw or write one connection between this lesson and something you already know',
        narrationScript: `Incredible work today, ${name}! You just explored ${unit} — that's something to be really proud of. You're building an amazing brain!`,
      },
    ],
    quiz: [
      {
        question: samples[0] ? `Try: ${samples[0]}` : `What is the main focus of the ${unit} unit?`,
        options: ['To memorise formulas', 'To understand and apply concepts', 'To copy from textbooks', 'To avoid making mistakes'],
        correct: 1, explanation: 'IB education focuses on understanding and real-world application, not just memorisation.',
        difficulty: 'medium',
      },
      {
        question: topics[0] ? `Which best describes "${topics[0]}"?` : 'What does IB education emphasise?',
        options: ['Pure memorisation', 'Real-world connections and inquiry', 'Speed in calculations', 'Avoiding difficult problems'],
        correct: 1, explanation: 'IB emphasises understanding and real-world application across all subjects.',
        difficulty: 'easy',
      },
      {
        question: 'What should you do when you get a question wrong?',
        options: ['Give up', 'Learn from the mistake and try again', 'Skip it forever', 'Copy someone else\'s answer'],
        correct: 1, explanation: 'Mistakes are how your brain learns — every error is a step toward mastery!',
        difficulty: 'easy',
      },
    ],
    encouragement: `Brilliant effort today, ${name}! You explored ${unit} with ${narrator.name}. That takes courage and intelligence. Keep going! 🏆`,
    brainBreakTip: 'Roll your shoulders back 5 times, then forward 5 times. This releases tension and helps your brain consolidate what you just learned!',
  };
}

// ── API Route ───────────────────────────────────────────────────────────────────
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

  const ibCtx = getIBContext(subject, numGrade);

  // Check cache
  const cacheKey = `${subject}_g${numGrade}_${difficulty}_${language}`;
  const cached = lessonCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json({ lesson: cached.lesson, cached: true });
  }

  // Build prompt and generate
  const prompt = buildLessonPrompt({ subject, grade: numGrade, language, studentName, emotion, difficulty, ibCtx, studentClass });

  let lesson: object;

  try {
    const text = await generateWithFallback(prompt, () => {});
    if (text) {
      const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      lesson = JSON.parse(clean);
    } else {
      lesson = buildFallback(subject, numGrade, studentName ?? '', ibCtx, studentClass);
    }
  } catch (err) {
    console.error('[generate-lesson] AI generation failed:', err);
    lesson = buildFallback(subject, numGrade, studentName ?? '', ibCtx, studentClass);
  }

  // Cache and return
  lessonCache.set(cacheKey, { lesson, ts: Date.now() });
  return NextResponse.json({ lesson });
}
