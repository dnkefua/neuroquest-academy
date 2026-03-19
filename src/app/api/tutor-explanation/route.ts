import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { question, studentAnswer, correctAnswer, studentName, grade, language } = await req.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a gentle, kind AI tutor for a ${grade}-grade neurodiverse student.
${studentName} answered "${studentAnswer}" to this question: "${question}"
The correct answer is: "${correctAnswer}"

Write a warm, encouraging explanation in 2 sentences:
- First sentence: acknowledge their effort (never say "wrong")
- Second sentence: clearly explain why "${correctAnswer}" is correct

Rules:
- Use simple vocabulary for grade ${grade}
- No idioms, no sarcasm, no negative language
- Be warm and encouraging
- ${language === 'AR' ? 'Write in Arabic' : 'Write in English'}
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
