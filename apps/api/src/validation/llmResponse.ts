import { llmOutputSchema } from '@repo/validation';

export function parseScoreResponse(rawContent: string) {
  let text = rawContent.trim();

  // strip markdown fences
  text = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '');

  // attempt direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // fallback: extract JSON object
    const match = text.match(/\{[\s\S]*/); // grab from first { to end
    if (!match) throw new Error('No JSON object found in response');

    try {
      return JSON.parse(match[0]);
    } catch {
      throw new Error(`Truncated or malformed JSON. Raw preview: ${text.slice(0, 200)}`);
    }
  }
}

export function validateScoreResponse(data: unknown) {
  const result = llmOutputSchema.safeParse(data);
  if (result.success) {
    return result.data;
  }

  const issues = result.error.issues
    .map((i) => {
      const path = i.path.length > 0 ? `At ${i.path.join('.')}: ` : '';
      return `- ${path}${i.message}`;
    })
    .join('\n');

  throw new Error(issues);
}
