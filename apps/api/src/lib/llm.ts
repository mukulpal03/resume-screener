import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { systemPrompt } from '../utils/prompt';

export interface LLMProvider {
  generateContent(prompt: string): Promise<string>;
}

class GeminiProvider implements LLMProvider {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    });
  }

  async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}

class OpenAIProvider implements LLMProvider {
  private openai: OpenAI;
  private modelName: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.modelName = process.env.OPENAI_MODEL || 'gpt-4o';
  }

  async generateContent(prompt: string): Promise<string> {
    const response = await this.openai.responses.create({
      model: this.modelName,
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: systemPrompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
      ],
    });

    return response.output_text || '';
  }
}

const getProvider = (): LLMProvider => {
  const provider = process.env.LLM_PROVIDER?.toLowerCase() || 'openai';

  switch (provider) {
    case 'gemini':
      return new GeminiProvider();
    case 'openai':
      return new OpenAIProvider();
    default:
      // Fallback to OpenAI if not specified or unknown, as per user request
      return new OpenAIProvider();
  }
};

export const llm = getProvider();
