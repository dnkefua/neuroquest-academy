import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NPCReactionSchema } from '@/lib/schemas';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const FALLBACKS: Record<string, { correct: string; incorrect: string }> = {
  Omar: {
    correct: 'Thank you so much! That means a lot to me. You are a really kind friend!',
    incorrect: 'Oh... that felt a bit awkward. Maybe next time we could talk about it together?',
  },
  Fatima: {
    correct: 'You came to help me — that made me feel so much better. Thank you!',
    incorrect: 'I felt a little sad when that happened, but I know you did not mean any harm.',
  },
  Group: {
    correct: 'We loved hearing your idea! Everyone was listening and it added so much to the discussion.',
    incorrect: 'It felt a bit rushed. Next time, maybe wait until everyone is ready — then we can all hear you!',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = NPCReactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { npcName, situation, studentChoice, wasCorrect, studentName, grade, language } = parsed.data;
    const numGrade = typeof grade === 'string' ? parseInt(grade, 10) : grade;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are ${npcName}, a child character in a social skills learning scenario for grade ${numGrade} students.

Situation: ${situation}
The student named ${studentName ?? 'the student'} chose to respond by: "${studentChoice}"
This response was ${wasCorrect ? 'KIND and CORRECT' : 'NOT the best choice'}.

Write ${npcName}'s reaction in 1-2 sentences:
- If correct: React with genuine warmth, gratitude, or happiness as ${npcName}.
- If incorrect: React realistically but gently — show how it made you feel without being harsh or mean.

Rules:
- Speak ONLY as ${npcName} — no narration, no quotation marks
- Age-appropriate for grade ${numGrade} (ages ${numGrade + 5}-${numGrade + 6})
- ${language === 'AR' || language === 'ar' ? 'Write in Arabic.' : 'Write in English.'}
- Maximum 2 sentences. Warm and child-friendly.`;

    const result = await model.generateContent(prompt);
    const reaction = result.response.text().trim();
    return NextResponse.json({ reaction });
  } catch {
    const fallback = FALLBACKS[npcName] ?? { correct: 'Thank you, that was so kind!', incorrect: 'That felt a little unexpected, but I appreciate you trying.' };
    return NextResponse.json({ reaction: wasCorrect ? fallback.correct : fallback.incorrect });
  }
}
