import { parseScoreResponse, validateScoreResponse } from '../validation/llmResponse';
import { model } from '../lib/llm';
import { ResumeResult } from '@repo/types';
import { db, resultsTable, Suggestion } from '@repo/db';

async function analyzeResume(resumeText: string, jdText: string): Promise<ResumeResult> {
  try {
    const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON.`;

    const result = await model.generateContent(userPrompt);
    const raw = result.response.text();
    const parsed = parseScoreResponse(raw);

    validateScoreResponse(parsed);

    return parsed;
  } catch (error) {
    console.error('Resume analysis failed:', error);
    if (error instanceof Error) {
      const { message } = error;
      if (message.startsWith('Validation failed')) throw error;
      if (message.startsWith('No JSON object found')) throw error;
      if (message.startsWith('Truncated or malformed JSON')) throw error;
    }
    throw new Error('Failed to analyze resume', { cause: error });
  }
}

async function saveResult(
  userId: number,
  result: ResumeResult,
  resumeText: string,
  jobDescription: string
) {
  try {
    const newResult = await db
      .insert(resultsTable)
      .values({
        userId: userId,
        jobTitle: result.job_title || '',
        candidateName: result.candidate_name || '',
        jobDescription: jobDescription,
        resumeText: resumeText,
        overallScore: result.overall_score,
        skillsMatchScore: result.breakdown.skills_match,
        experienceRelevanceScore: result.breakdown.experience_relevance,
        educationScore: result.breakdown.education,
        matchedKeywords: result.matched_keywords,
        missingKeywords: result.missing_keywords,
        suggestions: result.suggestions as Suggestion[],
        summary: result.summary ?? '',
      })
      .returning();

    return newResult;
  } catch (error) {
    console.error('Failed to save screening result:', error);
    throw new Error('Failed to save result', { cause: error });
  }
}

export { analyzeResume, saveResult };
