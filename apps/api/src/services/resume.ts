import { parseScoreResponse, validateScoreResponse } from '../validation/llmResponse';
import { model } from '../lib/llm';
import { ResumeResult } from '@repo/types';
import { db, resultsTable } from '@repo/db';

async function analyzeResume(resumeText: string, jdText: string) {
  const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON.`;

  const result = await model.generateContent(userPrompt);

  const raw = result.response.text();

  const parsed = parseScoreResponse(raw);

  validateScoreResponse(parsed);

  return parsed;
}

async function saveResult(result: ResumeResult, resumeText: string, jobDescription: string) {
  try {
    const newResult = await db
      .insert(resultsTable)
      .values({
        jobDescription: jobDescription,
        resumeText: resumeText,
        overallScore: result.overall_score,
        skillsMatchScore: result.breakdown.skills_match,
        experienceRelevanceScore: result.breakdown.experience_relevance,
        educationScore: result.breakdown.education,
        matchedKeywords: result.matched_keywords,
        missingKeywords: result.missing_keywords,
        suggestions: result.suggestions,
        summary: result.summary ?? '',
      })
      .returning();

    return newResult;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to save result');
  }
}

export { analyzeResume, saveResult };
