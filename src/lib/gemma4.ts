/**
 * Google Gemma4 Lightweight AI Integration for NeuroQuest
 * 
 * Supports multiple AI backends with animated explainer generation:
 * 1. Google Vertex AI - Gemma 4 (2B/7B parameters) via Vertex AI endpoint
 * 2. Ollama - Local Gemma4 for offline/demo mode
 * 3. Google Gemini - Cloud fallback
 * 4. Mock mode - For demo/testing without API calls
 * 
 * Gemma4 is an open-weight model optimized for:
 * - On-device inference (2B parameter variant)
 * - Educational content generation
 * - Safe, consistent responses
 * - Animated explainers with narration
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export type GemmaModel = 'gemma-4-2b-it' | 'gemma-4-7b-it' | 'gemma3-4b-it';
export type AIProvider = 'vertex-gemma' | 'ollama' | 'gemini' | 'mock';

export interface AIConfig {
  provider: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface AIResponse {
  text: string;
  provider: AIProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latency?: number;
}

export interface LessonGenerationOptions {
  subject: string;
  grade: number;
  topic: string;
  language: 'EN' | 'AR';
  studentName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  emotion?: 'happy' | 'neutral' | 'frustrated' | 'anxious';
  studentClass: 'math' | 'science' | 'english' | 'arabic';
}

// ============================================
// ANIMATED EXPLAINER TYPES
// ============================================

export interface AnimationStep {
  id: string;
  narration: string;           // Text to speak aloud
  visualDescription: string;   // Description of what to show
  highlightElements?: string[]; // Elements to highlight
  duration: number;            // Duration in ms
  animationType: 'fade' | 'slide' | 'scale' | 'draw' | 'bounce' | 'pulse';
  visualContent?: {
    type: 'diagram' | 'numberLine' | 'fraction' | 'equation' | 'chart' | 'image' | 'text';
    data: Record<string, unknown>;
  };
}

export interface AnimatedLesson {
  title: string;
  steps: AnimationStep[];
  summary: string;
  quiz: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
  encouragement: string;
  brainBreakTip: string;
}

export interface TutorExplanation {
  text: string;
  animation?: {
    type: 'appear' | 'highlight' | 'move' | 'transform';
    target: string;
    duration: number;
  }[];
  examples?: Array<{
    problem: string;
    solution: string;
    steps: string[];
  }>;
}

// ============================================
// SYSTEM PROMPTS
// ============================================

const EDUCATIONAL_SYSTEM_PROMPT = `You are NeuroQuest, an AI tutor for IB/MYP students aged 12-16 in Dubai, UAE. 
You specialize in making learning engaging, accessible, and neurodiverse-friendly. 
Key principles:
- Use simple, clear language
- Break complex concepts into small steps
- Include real-world UAE/Dubai examples
- Celebrate mistakes as learning opportunities
- Adapt tone to student emotional state
- Always prioritize understanding over speed
- Align with IB MYP curriculum standards
- Support both English and Arabic content
- Use encouraging, positive language
- Include brain breaks and movement suggestions

Response format: JSON with clear structure`;

const ANIMATION_SYSTEM_PROMPT = `You are an educational animation director for NeuroQuest Academy. 
Generate step-by-step animated explainer content with narration cues.

For each step, provide:
- narration: What the AI tutor should say (keep under 30 words, student-friendly)
- visualDescription: What should appear/animate on screen
- animationType: fade | slide | scale | draw | bounce | pulse
- duration: Approximate duration in ms (1000-4000)
- visualContent: Structured data for rendering diagrams, math, etc.

Math concepts: Use number lines, fraction visualizers, equation steppers
Science concepts: Use diagrams, particle animations, force arrows
Keep steps sequential and build understanding gradually.

Return JSON with structure:
{
  "title": "Lesson title",
  "steps": [{ narration, visualDescription, animationType, duration, visualContent }],
  "summary": "Brief summary",
  "quiz": [...],
  "encouragement": "...",
  "brainBreakTip": "..."
}`;

// ============================================
// AI CONFIGURATION
// ============================================

function getAIConfig(): AIConfig {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return { provider: 'mock', model: 'mock-gemma4' };
  }

  if (process.env.OLLAMA_BASE_URL) {
    return {
      provider: 'ollama',
      model: process.env.OLLAMA_GEMMA_MODEL || 'gemma3:4b',
      temperature: 0.7,
      maxTokens: 4096,
    };
  }

  if (process.env.GCP_PROJECT_ID && process.env.GCP_LOCATION) {
    return {
      provider: 'vertex-gemma',
      model: 'gemma-4-2b-it',
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.95,
    };
  }

  return { provider: 'gemini', model: 'gemini-2.0-flash' };
}

// ============================================
// AI PROVIDER CALLS
// ============================================

async function callVertexGemma(prompt: string, config: AIConfig): Promise<string> {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us-central1';
  const model = config.model || 'gemma-4-2b-it';

  const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:predict`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GCP_API_KEY || ''}`,
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxTokens || 4096,
        topP: config.topP || 0.95,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Vertex Gemma error: ${response.status}`);
  }

  const data = await response.json() as { predictions?: Array<{ content?: string }> };
  return data.predictions?.[0]?.content?.trim() || '';
}

async function callOllama(prompt: string, config: AIConfig): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = config.model || 'gemma3:4b';

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      system: EDUCATIONAL_SYSTEM_PROMPT,
      stream: false,
      options: {
        temperature: config.temperature || 0.7,
        num_predict: config.maxTokens || 4096,
        top_p: config.topP || 0.95,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json() as { response?: string };
  return data.response?.trim() || '';
}

async function callGemini(prompt: string, config: AIConfig): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ 
    model: config.model || 'gemini-2.0-flash',
    systemInstruction: EDUCATIONAL_SYSTEM_PROMPT,
  });

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ============================================
// MOCK RESPONSES
// ============================================

function generateMockLesson(topic: string, subject: string): AnimatedLesson {
  const mathTemplates: Record<string, AnimatedLesson> = {
    'fraction': {
      title: 'Understanding Fractions',
      steps: [
        { id: '1', narration: 'Imagine a pizza cut into equal parts', visualDescription: 'Show a whole pizza', animationType: 'scale', duration: 2000, visualContent: { type: 'image', data: { emoji: '🍕' } } },
        { id: '2', narration: 'When we cut it, each piece is a fraction of the whole', visualDescription: 'Slice animation', animationType: 'draw', duration: 2500, visualContent: { type: 'fraction', data: { parts: 4, highlighted: 1 } } },
        { id: '3', narration: 'The bottom number tells how many equal parts', visualDescription: 'Highlight denominator', animationType: 'pulse', duration: 2000, visualContent: { type: 'fraction', data: { numerator: 1, denominator: 4, highlight: 'denominator' } } },
        { id: '4', narration: 'The top number tells how many parts we have', visualDescription: 'Highlight numerator', animationType: 'pulse', duration: 2000, visualContent: { type: 'fraction', data: { numerator: 3, denominator: 4, highlight: 'numerator' } } },
        { id: '5', narration: '3 out of 4 pieces - that is three quarters!', visualDescription: 'Show fraction', animationType: 'bounce', duration: 2000, visualContent: { type: 'fraction', data: { numerator: 3, denominator: 4 } } },
      ],
      summary: 'A fraction shows part of a whole. The denominator is the bottom number (total parts), the numerator is the top number (parts we have).',
      quiz: [{ question: 'What does the denominator of a fraction represent?', options: ['Parts we have', 'Total equal parts', 'The whole', 'A quarter'], correct: 1, explanation: 'The denominator tells us how many equal parts the whole is divided into!' }],
      encouragement: 'You just learned about fractions! You are a math star!',
      brainBreakTip: 'Stand up and pretend you are slicing a big pizza with your arms!',
    },
    'algebra': {
      title: 'Introduction to Algebra',
      steps: [
        { id: '1', narration: 'Algebra uses letters to represent unknown numbers', visualDescription: 'Show variable X', animationType: 'fade', duration: 2000, visualContent: { type: 'equation', data: { equation: 'x + 5 = 10', highlight: 'x' } } },
        { id: '2', narration: 'Think of X like a mystery box - we need to find its value', visualDescription: 'Show mystery box', animationType: 'bounce', duration: 2000, visualContent: { type: 'image', data: { emoji: '🎁' } } },
        { id: '3', narration: 'To solve, we do the same thing to both sides', visualDescription: 'Balance scale', animationType: 'slide', duration: 3000, visualContent: { type: 'image', data: { emoji: '⚖️' } } },
        { id: '4', narration: 'Subtract 5 from both sides', visualDescription: 'Show subtraction', animationType: 'draw', duration: 2500, visualContent: { type: 'equation', data: { equation: 'x = 10 - 5', steps: ['x + 5 = 10', 'x = 10 - 5', 'x = 5'] } } },
        { id: '5', narration: 'X equals 5! Mystery solved!', visualDescription: 'Celebrate', animationType: 'pulse', duration: 2000, visualContent: { type: 'equation', data: { equation: 'x = 5', highlight: '5' } } },
      ],
      summary: 'In algebra, letters like X represent unknown values. We solve equations by doing the same operation to both sides.',
      quiz: [{ question: 'What is the value of X if X + 3 = 8?', options: ['3', '5', '8', '11'], correct: 1, explanation: 'X = 8 - 3 = 5. We subtract 3 from both sides!' }],
      encouragement: 'Algebra is like solving puzzles! You are getting great at this!',
      brainBreakTip: 'Jump 5 times for every step in your equation!',
    },
  };

  const scienceTemplates: Record<string, AnimatedLesson> = {
    'water-cycle': {
      title: 'The Water Cycle',
      steps: [
        { id: '1', narration: 'The sun warms up water in oceans and lakes', visualDescription: 'Show sun and water', animationType: 'fade', duration: 2000, visualContent: { type: 'diagram', data: { elements: ['sun', 'water'] } } },
        { id: '2', narration: 'Water turns into invisible vapor and rises up', visualDescription: 'Show evaporation arrows', animationType: 'slide', duration: 3000, visualContent: { type: 'diagram', data: { elements: ['arrows-up', 'vapor'], highlight: 'evaporation' } } },
        { id: '3', narration: 'High in the sky, the vapor cools and forms clouds', visualDescription: 'Show cloud formation', animationType: 'scale', duration: 2500, visualContent: { type: 'diagram', data: { elements: ['clouds'], highlight: 'condensation' } } },
        { id: '4', narration: 'When clouds get heavy, water falls as rain', visualDescription: 'Show rain', animationType: 'bounce', duration: 2500, visualContent: { type: 'diagram', data: { elements: ['raindrops'], highlight: 'precipitation' } } },
        { id: '5', narration: 'Water flows back to the ocean, and the cycle continues!', visualDescription: 'Show full cycle', animationType: 'pulse', duration: 2000, visualContent: { type: 'diagram', data: { elements: ['ocean', 'rivers', 'cycle'] } } },
      ],
      summary: 'The water cycle has 4 main steps: evaporation (sun heats water), condensation (vapor becomes clouds), precipitation (rain falls), and collection (water flows back).',
      quiz: [{ question: 'What is it called when water vapor becomes clouds?', options: ['Evaporation', 'Condensation', 'Precipitation', 'Collection'], correct: 1, explanation: 'Condensation is when water vapor cools and forms clouds!' }],
      encouragement: 'You learned the water cycle! Nature is amazing!',
      brainBreakTip: 'Make rain sounds with your fingers tapping your legs!',
    },
  };

  // Return matching template or generate generic
  if (subject === 'math') {
    for (const key of Object.keys(mathTemplates)) {
      if (topic.toLowerCase().includes(key)) return mathTemplates[key];
    }
  }
  if (subject === 'science') {
    for (const key of Object.keys(scienceTemplates)) {
      if (topic.toLowerCase().includes(key)) return scienceTemplates[key];
    }
  }

  // Generic fallback
  return {
    title: `Learning about ${topic}`,
    steps: [
      { id: '1', narration: `Let us explore ${topic} together!`, visualDescription: 'Introduction', animationType: 'fade', duration: 2000, visualContent: { type: 'text', data: { message: `Welcome to ${topic}!` } } },
      { id: '2', narration: 'Here is the key concept', visualDescription: 'Show main idea', animationType: 'scale', duration: 3000, visualContent: { type: 'text', data: { message: 'Key concept appears here' } } },
      { id: '3', narration: 'Now let us practice!', visualDescription: 'Practice example', animationType: 'bounce', duration: 2500, visualContent: { type: 'text', data: { message: 'Try this example!' } } },
    ],
    summary: `Today we explored ${topic}. Keep practicing to master this concept!`,
    quiz: [{ question: `How well do you understand ${topic}?`, options: ['Very well!', 'Okay', 'Need more practice', 'Not at all'], correct: 0, explanation: 'Keep learning and you will get better!' }],
    encouragement: `Great job exploring ${topic}! You are making progress!`,
    brainBreakTip: 'Take 5 deep breaths and stretch your arms wide!',
  };
}

function generateMockResponse(prompt: string): string {
  if (prompt.toLowerCase().includes('lesson') || prompt.toLowerCase().includes('explain')) {
    return JSON.stringify(generateMockLesson('general', 'math'));
  }
  return JSON.stringify({ response: 'Demo response from Gemma4 AI', note: 'Enable AI provider for real responses' });
}

// ============================================
// MAIN AI FUNCTIONS
// ============================================

export async function generateWithAI(
  prompt: string,
  options?: Partial<AIConfig>
): Promise<AIResponse> {
  const startTime = Date.now();
  const config = { ...getAIConfig(), ...options };

  try {
    let text: string;

    switch (config.provider) {
      case 'ollama':
        text = await callOllama(prompt, config);
        break;
      case 'vertex-gemma':
        try {
          text = await callVertexGemma(prompt, config);
        } catch (err) {
          console.warn('[Gemma4] Vertex unavailable, falling back to Gemini:', err);
          text = await callGemini(prompt, config);
        }
        break;
      case 'gemini':
        text = await callGemini(prompt, config);
        break;
      case 'mock':
      default:
        text = generateMockResponse(prompt);
        break;
    }

    return {
      text,
      provider: config.provider,
      model: config.model || 'unknown',
      latency: Date.now() - startTime,
    };

  } catch (error) {
    console.error('[Gemma4] All AI providers failed, using mock:', error);
    return {
      text: generateMockResponse(prompt),
      provider: 'mock',
      model: 'mock-fallback',
      latency: Date.now() - startTime,
    };
  }
}

// ============================================
// LESSON GENERATION
// ============================================

export async function generateLesson(options: LessonGenerationOptions): Promise<AnimatedLesson> {
  const emotionCtx = {
    frustrated: 'Use very short sentences, emojis, celebrate every small win. Start with the easiest idea.',
    anxious: 'Use calm, warm tone. Reassure often. Start with something they know.',
    happy: 'Be upbeat! Include a fun fact.',
    neutral: 'Be warm, curious, engaging. Make content feel like an adventure.',
  }[options.emotion || 'neutral'];

  const difficultyCtx = {
    easy: 'Use very simple examples. 3-4 steps only. One concept per section.',
    medium: 'Include one multi-step problem. 5-6 steps. Mix recall and application.',
    hard: 'Include exam-style questions. 7-8 steps. Multi-step reasoning. Extension challenges.',
  }[options.difficulty];

  const prompt = `Generate an animated IB/MYP lesson for Grade ${options.grade} ${options.subject}.

Student: ${options.studentName}
Language: ${options.language}
Topic: ${options.topic}
Class: ${options.studentClass}

Context: ${emotionCtx}
Difficulty: ${difficultyCtx}

Generate JSON with animated explainer steps:
{
  "title": "Lesson title",
  "steps": [{ 
    "id": "step-1", 
    "narration": "What tutor says (under 30 words)", 
    "visualDescription": "What shows on screen", 
    "animationType": "fade|slide|scale|draw|bounce|pulse",
    "duration": ms,
    "visualContent": { type: "fraction|equation|diagram|image|numberLine", data: {...} }
  }],
  "summary": "Brief lesson summary",
  "quiz": [{ "question": "", "options": [], "correct": 0, "explanation": "" }],
  "encouragement": "Motivational closing",
  "brainBreakTip": "Quick movement suggestion"
}`;

  const response = await generateWithAI(prompt);

  try {
    const clean = response.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(clean) as AnimatedLesson;
  } catch {
    return generateMockLesson(options.topic, options.subject);
  }
}

// ============================================
// TUTOR EXPLANATION
// ============================================

export async function generateTutorExplanation(
  topic: string,
  studentName: string,
  emotion?: string,
  includeAnimation = true
): Promise<TutorExplanation> {
  const tone = emotion === 'frustrated' 
    ? 'Extra simple and encouraging. Use emojis. Celebrate every small step.'
    : emotion === 'anxious' 
    ? 'Calm and reassuring. Start with something they definitely know.'
    : 'Warm and engaging. Make learning feel like an adventure.';

  const prompt = includeAnimation
    ? `As NeuroQuest tutor, explain "${topic}" to ${studentName}.
        Tone: ${tone}
        Format: JSON with text and animation hints
        Include 2-3 worked examples with step-by-step solutions
        Use UAE/Dubai context when relevant`
    : `As NeuroQuest tutor, explain "${topic}" to ${studentName}.
        Tone: ${tone}
        Keep explanation under 200 words. Clear, simple, encouraging.
        Use examples the student can relate to.`;

  const response = await generateWithAI(prompt);

  try {
    const clean = response.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(clean) as TutorExplanation;
  } catch {
    return {
      text: `Let me explain ${topic} in a way that makes sense!

Think of ${topic} like something you already know. When you understand the basics, you can build from there.

Let me break this down step by step so it becomes clear.

Remember: Every expert was once a beginner, and you are doing great!`,
      examples: [
        {
          problem: `Understanding ${topic}`,
          solution: 'Break it into small parts and practice each one',
          steps: ['Identify the main idea', 'Practice with examples', 'Build confidence step by step'],
        },
      ],
    };
  }
}

// ============================================
// ANIMATION SCRIPT GENERATION
// ============================================

export async function generateAnimationScript(
  concept: string,
  visualType: 'fraction' | 'equation' | 'diagram' | 'chart' | 'numberLine'
): Promise<AnimationStep[]> {
  const prompt = `Generate animation steps for visualizing "${concept}" as a ${visualType}.

Each step should include:
- narration: What to say (under 25 words)
- visualDescription: What animates
- animationType: fade | slide | scale | draw | bounce | pulse
- duration: milliseconds
- visualContent: Data structure for rendering

Generate 4-6 sequential steps that build understanding.
Return JSON array of steps.`;

  const response = await generateWithAI(prompt);

  try {
    const clean = response.text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(clean) as AnimationStep[];
  } catch {
    return generateMockLesson(concept, 'math').steps;
  }
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkAIAvailability(): Promise<{ available: boolean; provider: AIProvider; latency: number }> {
  const start = Date.now();
  const config = getAIConfig();

  try {
    await generateWithAI('Quick test', { provider: config.provider });
    return { available: true, provider: config.provider, latency: Date.now() - start };
  } catch {
    return { available: false, provider: config.provider, latency: Date.now() - start };
  }
}

// Backwards compatibility
export const generateWithFallback = generateWithAI;
