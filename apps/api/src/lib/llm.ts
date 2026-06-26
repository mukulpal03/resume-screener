import { initChatModel } from 'langchain';

export const getModel = async (modelName?: string, options?: Record<string, unknown>) => {
  const provider = process.env.LLM_PROVIDER?.toLowerCase() || 'openai';

  const defaultOptions = {
    temperature: 0,
    maxRetries: 6,
    ...options,
  };

  if (provider === 'gemini') {
    return await initChatModel(modelName || process.env.GOOGLE_MODEL || 'gemini-2.5-flash', {
      modelProvider: 'google',
      ...defaultOptions,
    });
  } else {
    return await initChatModel(modelName || process.env.OPENAI_MODEL || 'gpt-4o-mini', {
      modelProvider: 'openai',
      ...defaultOptions,
    });
  }
};
