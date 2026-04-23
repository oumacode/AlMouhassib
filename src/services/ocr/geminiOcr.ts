import { File } from 'expo-file-system';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = process.env.EXPO_PUBLIC_GEMINI_MODEL ?? 'gemini-1.5-flash';

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
};

const getGeminiApiKey = () => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to your .env file before running OCR.'
    );
  }

  return apiKey;
};

const detectMimeType = (imageUri: string) => {
  const pathWithoutQuery = imageUri.split('?')[0].toLowerCase();

  if (pathWithoutQuery.endsWith('.png')) return 'image/png';
  if (pathWithoutQuery.endsWith('.webp')) return 'image/webp';
  if (pathWithoutQuery.endsWith('.heic')) return 'image/heic';
  if (pathWithoutQuery.endsWith('.heif')) return 'image/heif';
  return 'image/jpeg';
};

export const extractTextWithGemini = async (imageUri: string): Promise<string> => {
  const apiKey = getGeminiApiKey();

  const base64Image = await new File(imageUri).base64();

  const prompt = [
    'You are an OCR engine specialized in invoices and receipts.',
    'Extract all visible text from this document exactly as it appears.',
    'Preserve line breaks when possible.',
    'Return only plain text without markdown or explanations.',
  ].join(' ');

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: detectMimeType(imageUri),
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0,
      topP: 1,
      topK: 1,
      maxOutputTokens: 4096,
    },
  };

  const response = await fetch(`${GEMINI_API_BASE}/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const failureDetails = await response.text();
    throw new Error(`Gemini OCR failed (${response.status}): ${failureDetails}`);
  }

  const result = (await response.json()) as GeminiGenerateResponse;
  if (result.error?.message) {
    throw new Error(`Gemini OCR error: ${result.error.message}`);
  }

  if (result.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the OCR request: ${result.promptFeedback.blockReason}`);
  }

  const text = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('\n')
    .trim();

  if (!text) {
    throw new Error('No text detected in the selected image.');
  }

  return text;
};
