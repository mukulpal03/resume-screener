import { initChatModel } from 'langchain';
import { env } from '../config/env';

export const getModel = async (modelName?: string, options?: Record<string, unknown>) => {
  const provider = env.LLM_PROVIDER;

  const defaultOptions = {
    temperature: 0,
    maxRetries: 6,
    ...options,
  };

  if (provider === 'gemini') {
    return await initChatModel(modelName || env.GOOGLE_MODEL, {
      modelProvider: 'google',
      ...defaultOptions,
    });
  } else {
    return await initChatModel(modelName || env.OPENAI_MODEL, {
      modelProvider: 'openai',
      ...defaultOptions,
    });
  }
};
