/**
 * GCP Vertex AI client for NeuroQuest.
 * Uses Vertex AI endpoint for Gemini 2.0 Flash with full GCP auth.
 * Falls back to @google/generative-ai SDK if Vertex is unavailable.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-2.0-flash';

function getGenAI() {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

/**
 * Call Vertex AI Gemini via the REST API directly.
 * This avoids the heavy @google-cloud/aiplatform SDK weight while
 * still routing through Vertex AI's infrastructure.
 */
export async function callVertexAI(prompt: string): Promise<string> {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us-central1';
  const apiKey = process.env.GCP_API_KEY; // Vertex API key (separate from Gemini key)

  if (!projectId || !apiKey) {
    throw new Error('GCP_PROJECT_ID or GCP_API_KEY not configured');
  }

  const url =
    `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}` +
    `/publishers/google/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.95,
        topK: 40,
      },
      systemInstruction: {
        parts: [{ text: 'You are an IB-certified neurodiverse educator for students aged 6-18 in Dubai, UAE.' }],
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Vertex AI error ${response.status}: ${err}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
    ''
  );
}

/**
 * Generate lesson content with fallback chain:
 * 1. Vertex AI Gemini 2.0 Flash
 * 2. @google/generative-ai SDK Gemini
 * 3. Structured fallback (no external call)
 */
export async function generateWithFallback(
  prompt: string,
  onFallback: () => void
): Promise<string> {
  // Try Vertex AI first
  try {
    const text = await callVertexAI(prompt);
    if (text) return text;
  } catch (err) {
    console.warn('[VertexAI] Vertex unavailable, trying Gemini SDK:', err);
  }

  // Fall back to Gemini SDK
  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    if (text) return text;
  } catch (err) {
    console.warn('[GeminiSDK] Gemini unavailable:', err);
  }

  // Final fallback — caller handles missing response
  onFallback();
  return '';
}
