import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompt } from '../utils/prompt';

const genAI = new GoogleGenerativeAI('AIzaSyDMF7l3inRmoEQMa7MSkwPKVhgVjAHkYnI');

export const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: systemPrompt,
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
});
