import { parseScoreResponse, validateScoreResponse } from '../validation/llmResponse';
import { model } from '../lib/llm';

async function analyzeResume(resumeText: string, jdText: string) {
  const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON.`;

  const result = await model.generateContent(userPrompt);

  const raw = result.response.text();

  const parsed = parseScoreResponse(raw);

  validateScoreResponse(parsed);

  return parsed;
}

export { analyzeResume };
