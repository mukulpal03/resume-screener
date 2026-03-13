import { parseScoreResponse, validateScoreResponse } from '../validation/llmResponse';
import { model } from '../lib/llm';

async function analyzeResume(resumeText: string, jdText: string) {
  const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON.`;

  console.log('wait for result');

  const result = await model.generateContent(userPrompt);

  console.log('got the result');

  const raw = result.response.text();

  const parsed = parseScoreResponse(raw);

  console.log('parsed', parsed);

  validateScoreResponse(parsed);

  return parsed;
}

export { analyzeResume };
