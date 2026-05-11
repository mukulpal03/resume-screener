/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import OpenAI from 'openai';
import { systemPrompt } from '../utils/prompt';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMSession {
  sendMessage(content: string): Promise<string>;
}

export interface LLMProvider {
  createSession(): Promise<LLMSession>;
}

class GeminiSession implements LLMSession {
  private chat;

  constructor(model: GenerativeModel) {
    this.chat = model.startChat();
  }

  async sendMessage(content: string): Promise<string> {
    const result = await this.chat.sendMessage(content);
    return result.response.text();
  }
}

class GeminiProvider implements LLMProvider {
  private model: GenerativeModel;

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

  async createSession(): Promise<LLMSession> {
    return new GeminiSession(this.model);
  }

  async generateContent(messages: Message[]): Promise<string> {
    const session = await this.createSession();
    let response = '';
    for (const msg of messages) {
      response = await session.sendMessage(msg.content);
    }
    return response;
  }
}

class OpenAISession implements LLMSession {
  private openai: OpenAI;
  private modelName: string;
  private conversationId: string;
  private isFirstMessage = true;

  constructor(openai: OpenAI, modelName: string, conversationId: string) {
    this.openai = openai;
    this.modelName = modelName;
    this.conversationId = conversationId;
  }

  async sendMessage(content: string): Promise<string> {
    const input: any[] = [];

    if (this.isFirstMessage) {
      input.push({
        role: 'developer',
        content: [{ type: 'input_text', text: systemPrompt }],
      });
      this.isFirstMessage = false;
    }

    input.push({
      role: 'user',
      content: [{ type: 'input_text', text: content }],
    });

    const response = await this.openai.responses.create({
      model: this.modelName,
      input,
      conversation: this.conversationId,
    });

    return (response as any).output_text || '';
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

  async createSession(): Promise<LLMSession> {
    const conversation = await (this.openai.conversations as any).create();
    return new OpenAISession(this.openai, this.modelName, conversation.id);
  }

  async generateContent(messages: Message[]): Promise<string> {
    const session = await this.createSession();
    let response = '';
    for (const msg of messages) {
      response = await session.sendMessage(msg.content);
    }
    return response;
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
      return new OpenAIProvider();
  }
};

export const llm = getProvider();
