import { parseScoreResponse, validateScoreResponse } from '../validation/llmResponse';
import { llm } from '../lib/llm';
import { ResumeResult } from '@repo/types';
import { db, resultsTable, Suggestion } from '@repo/db';
import { InternalServerError, UnprocessableEntityError } from '../utils/errors';

async function analyzeResume(resumeText: string, jdText: string): Promise<ResumeResult> {
  try {
    const userPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON.`;

    const raw = await llm.generateContent(userPrompt);
    const parsed = parseScoreResponse(raw);

    validateScoreResponse(parsed);

    return parsed;
  } catch (error) {
    if (error instanceof UnprocessableEntityError) throw error;

    // eslint-disable-next-line no-console
    console.error('Resume analysis failed:', error);
    if (error instanceof Error) {
      const { message } = error;
      if (
        message.startsWith('Validation failed') ||
        message.startsWith('No JSON object found') ||
        message.startsWith('Truncated or malformed JSON')
      ) {
        throw new UnprocessableEntityError(message);
      }
    }
    throw new InternalServerError('Failed to analyze resume');
  }
}

async function saveResult(
  userId: number,
  result: ResumeResult,
  resumeText: string,
  jobDescription: string
) {
  try {
    const rows = await db
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

    const row = rows[0];
    if (!row) {
      throw new InternalServerError('Failed to save result: No row returned');
    }

    return row;
  } catch (error) {
    if (error instanceof InternalServerError) throw error;

    // eslint-disable-next-line no-console
    console.error('Failed to save screening result:', error);
    throw new InternalServerError('Failed to save result');
  }
}

export { analyzeResume, saveResult };
