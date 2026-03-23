import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TutorExplanationSchema } from '@/lib/schemas';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TutorExplanationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { question, studentAnswer, correctAnswer, studentName, grade, language } = parsed.data;
    const numGrade = typeof grade === 'string' ? parseInt(grade, 10) : grade;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a gentle, kind AI tutor for a ${numGrade}-grade neurodiverse student.
${studentName ?? 'The student'} answered "${studentAnswer}" to this question: "${question}"
The correct answer is: "${correctAnswer}"

Write a warm, encouraging explanation in 2 sentences:
- First sentence: acknowledge their effort (never say "wrong")
- Second sentence: clearly explain why "${correctAnswer}" is correct

Rules:
- Use simple vocabulary for grade ${numGrade}
- No idioms, no sarcasm, no negative language
- Be warm and encouraging
- ${language === 'AR' || language === 'ar' ? 'Write in Arabic' : 'Write in English'}
- Return ONLY the explanation text, nothing else`;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text().trim();

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Tutor explanation error:', error);
    return NextResponse.json(
      { explanation: 'Great try! The correct answer gives us the best outcome in this situation. You\'re learning so well!' },
      { status: 200 }
    );
  }
}
