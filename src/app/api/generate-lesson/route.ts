import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getIBContext } from '@/lib/ib-curriculum';

// Simple in-memory cache — persists per server process (24h TTL)
const lessonCache = new Map<string, { lesson: object; ts: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function buildFallback(subject: string, _grade: number, studentName: string, ibCtx: ReturnType<typeof getIBContext>) {
  const subjectLabel = subject.replace(/-/g, ' ');
  const unit = ibCtx?.unit ?? subjectLabel;
  const topics = ibCtx?.topics ?? [];
  const samples = ibCtx?.sampleProblems ?? [];
  const name = studentName || 'there';

  return {
    title: `📖 ${ibCtx?.framework ?? 'IB'}: ${unit}`,
    intro: `Hey ${name}! 👋 Today we're diving into ${unit}. This is part of your ${ibCtx?.framework ?? 'IB'} curriculum — real content that will help you in your exams and in life. Let's explore it together!`,
    ibTopicKey: ibCtx?.ibTopicKey ?? subject,
    sections: [
      {
        heading: `🌟 What is ${unit}?`,
        content: topics[0]
          ? `In this unit we focus on ${topics[0]}. ${ibCtx?.priorKnowledge ? `You already know: ${ibCtx.priorKnowledge}` : ''} Let's build on that!`
          : `${unit} is a key IB topic that builds your problem-solving skills. Every concept connects to real life.`,
        activity: topics[1] ? `Try this: think of a real-world example of "${topics[1]}" — where have you seen it today?` : 'Write down one question you have about this topic.',
      },
      {
        heading: `💡 Key Concepts`,
        content: topics.slice(0, 3).join(' • ') || 'The key ideas in this unit build on each other step by step.',
        activity: samples[0] ? `Practice problem: ${samples[0]}` : 'Explain this concept in your own words to a friend.',
      },
      {
        heading: `🎯 Putting It Into Practice`,
        content: `The IB expects you to apply these ideas in unfamiliar contexts. ${samples[1] ? `Here is a typical exam-style question: ${samples[1]}` : 'Practice is the key to mastery — every attempt strengthens your brain.'}`,
        activity: samples[2] ? `Challenge: ${samples[2]}` : 'Create your own example problem and try to solve it!',
      },
    ],
    quiz: [
      {
        question: samples[0] ? `Solve or answer: ${samples[0]}` : `What is the main focus of the ${unit} unit?`,
        options: ['To memorise formulas', 'To understand and apply concepts', 'To copy from textbooks', 'To avoid making mistakes'],
        correct: 1,
        explanation: 'The IB focuses on deep understanding and application, not just memorisation.',
      },
      {
        question: topics[0] ? `Which of these best describes "${topics[0]}"?` : 'What does the IB MYP/PYP emphasise in Mathematics?',
        options: ['Pure memorisation', 'Real-world connections and inquiry', 'Speed in calculations', 'Avoiding difficult problems'],
        correct: 1,
        explanation: 'IB education emphasises understanding and real-world application across all subjects.',
      },
      {
        question: 'What should you do when you get a question wrong?',
        options: ['Give up', 'Learn from the mistake and try again', 'Skip it forever', 'Copy someone else\'s answer'],
        correct: 1,
        explanation: 'Mistakes are how your brain learns — every error is a step toward mastery!',
      },
    ],
    encouragement: `Brilliant effort today, ${name}! You just worked through real IB content — ${unit}. That takes courage and intelligence. Keep going! 🏆`,
    brainBreakTip: 'Roll your shoulders back 5 times, then forward 5 times. This releases tension and helps your brain consolidate what you just learned!',
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { subject, grade, language, studentName, emotion, difficulty = 'medium' } = body;

  if (!subject || !grade || !language) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const ibCtx = getIBContext(subject, grade);

  // ── Check in-memory cache (24-hour TTL) ──
  const cacheKey = `${subject}_g${grade}_${difficulty}_${language}`;
  const cached = lessonCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json({ lesson: cached.lesson, cached: true });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const emotionContext = {
      frustrated: 'The student is feeling FRUSTRATED. Use very short sentences, lots of emojis, break into tiny steps, celebrate every small win. Start with the easiest possible idea.',
      anxious: 'The student is feeling ANXIOUS. Use an extra calm, warm tone. Reassure them often ("You\'ve got this!"). Start with something they definitely know.',
      neutral: 'The student is in a neutral state. Be engaging and curious-making. Include a surprising fact.',
      happy: 'The student is feeling HAPPY and energised! Be upbeat and challenging. Include a fun "did you know?" fact.',
    }[emotion as string] ?? 'The student is ready to learn. Be warm and clear.';

    const difficultyContext = {
      easy: 'DIFFICULTY: Easy. Use very simple examples. Ask straightforward recall questions. Focus on one concept only.',
      medium: 'DIFFICULTY: Medium. Include one multi-step problem. Mix recall and application questions.',
      hard: 'DIFFICULTY: Hard (this student is performing well). Include exam-style questions, require multi-step reasoning, and challenge with extension ideas.',
    }[difficulty as string] ?? 'DIFFICULTY: Medium.';

    const ibSection = ibCtx ? `
IB CURRICULUM CONTEXT (very important — use this):
- Framework: ${ibCtx.framework}
- Unit: "${ibCtx.unit}"
- Specific topics to teach (choose 1-2 for this lesson): ${ibCtx.topics.join(', ')}
- Prior knowledge assumed: ${ibCtx.priorKnowledge}
${ibCtx.sampleProblems?.length ? `- Sample IB-style problems to reference: ${ibCtx.sampleProblems.join(' | ')}` : ''}
- Return "ibTopicKey": "${ibCtx.ibTopicKey}" in your JSON.
` : `- Subject: ${subject.replace(/-/g, ' ')}\n- Return "ibTopicKey": "${subject}-g${grade}" in your JSON.`;

    const prompt = `You are an IB-certified teacher specialising in neurodiverse learners (autism, ADHD) aged 6-18 in Dubai, UAE.

${ibSection}

Student profile:
- Name: ${studentName || 'the student'}
- Grade: ${grade}
- Language: ${language === 'AR' ? 'Arabic (UAE dialect friendly)' : 'English'}
- ${emotionContext}
- ${difficultyContext}

Create a complete, curriculum-accurate lesson. Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "IB unit name + emoji + engaging hook",
  "intro": "Warm 2-3 sentence welcome using student name, mentioning the specific IB topic, relating to emotion",
  "ibTopicKey": "exact ibTopicKey from above",
  "sections": [
    {
      "heading": "section heading with emoji",
      "content": "Curriculum-accurate explanation (3-5 sentences). For maths: show a worked example step by step. Reference UAE context where natural (souq prices, desert temperatures, Burj Khalifa height, etc.).",
      "activity": "Concrete hands-on or pencil-and-paper activity the student can do RIGHT NOW"
    }
  ],
  "quiz": [
    {
      "question": "IB-style question — for maths include numbers/equations",
      "options": ["option A", "option B", "option C", "option D"],
      "correct": 0,
      "explanation": "Clear explanation of why the answer is correct, with a hint for next time"
    }
  ],
  "encouragement": "Personalised closing message using student name, referencing what they just learned",
  "brainBreakTip": "Subject-relevant sensory or movement tip"
}

Rules:
- Exactly 3 sections, exactly 3 quiz questions
- Math lessons MUST include worked numerical examples (e.g. "Let's solve 2x + 5 = 13: step 1...")
- ${language === 'AR' ? 'Write ALL text in Arabic. Use Modern Standard Arabic with Gulf-friendly expressions.' : 'Write in clear English suitable for grade ' + grade}
- Make it genuinely curriculum-accurate, not generic. Reference specific IB terminology.
- Autism-friendly: clear structure, no idioms, no ambiguity, predictable format`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const lesson = JSON.parse(clean);

    // Write to in-memory cache
    lessonCache.set(cacheKey, { lesson, ts: Date.now() });

    return NextResponse.json({ lesson });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ lesson: buildFallback(subject, grade, studentName, ibCtx) });
  }
}
