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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateScoreResponse(data: any) {
  const errors = [];

  if (typeof data.overall_score !== 'number' || data.overall_score < 0 || data.overall_score > 100)
    errors.push('invalid overall_score');

  const breakdown = data.breakdown || {};
  for (const key of ['skills_match', 'experience_relevance', 'education']) {
    if (typeof breakdown[key] !== 'number') errors.push(`invalid breakdown.${key}`);
  }

  if (!Array.isArray(data.matched_keywords)) errors.push('matched_keywords must be array');
  if (!Array.isArray(data.missing_keywords)) errors.push('missing_keywords must be array');
  if (!Array.isArray(data.suggestions)) errors.push('suggestions must be array');

  if (errors.length > 0) throw new Error(`Validation failed: ${errors.join(', ')}`);

  return true;
}
