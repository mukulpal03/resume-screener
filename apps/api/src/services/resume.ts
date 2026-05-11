import { parseScoreResponse, validateScoreResponse } from '../validation/llmResponse';
import { llm } from '../lib/llm';
import { ResumeResult } from '@repo/types';
import { db, resultsTable, Suggestion } from '@repo/db';
import { InternalServerError, UnprocessableEntityError } from '../utils/errors';
import { schemaTemplate } from '../utils/prompt';

const MAX_RETRIES = 2;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function analyzeResume(resumeText: string, jdText: string): Promise<ResumeResult> {
  let attempts = 0;
  let lastError = '';
  const initialPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON according to the schema.`;

  const session = await llm.createSession();
  let currentMessage = initialPrompt;

  while (attempts <= MAX_RETRIES) {
    try {
      const raw = await session.sendMessage(currentMessage);
      const parsed = parseScoreResponse(raw);
      const validated = validateScoreResponse(parsed);

      if (attempts > 0) {
        // eslint-disable-next-line no-console
        console.info(`[LLM] Successfully recovered after ${attempts} retry/ies.`);
      }

      return validated;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error.message : 'Unknown error';

      if (attempts > MAX_RETRIES) {
        // eslint-disable-next-line no-console
        console.error(
          `[LLM] Analysis failed after ${MAX_RETRIES} retries. Final error: ${lastError}`
        );
        throw new UnprocessableEntityError(
          'Failed to analyze resume. The AI output was inconsistent. Please try again.'
        );
      }

      // eslint-disable-next-line no-console
      console.warn(
        `[LLM] Attempt ${attempts} failed: ${lastError}. Retrying in ${
          attempts === 1 ? '1s' : '3s'
        }...`
      );

      currentMessage = `IMPORTANT: Your previous response was invalid and failed validation.\nISSUES FOUND:\n${lastError}\n\nPlease fix these issues and return ONLY a valid JSON object matching this schema:\n${schemaTemplate}`;

      await delay(attempts === 1 ? 1000 : 3000);
    }
  }

  throw new InternalServerError('Unexpected retry loop exit');
}

async function saveResult(
  userId: number,
  result: ResumeResult,
  resumeText: string,
  jobDescription: string
) {
  try {
    const validated = validateScoreResponse(result);

    const rows = await db
      .insert(resultsTable)
      .values({
        userId: userId,
        jobTitle: validated.job_title,
        candidateName: validated.candidate_name,
        jobDescription: jobDescription,
        resumeText: resumeText,
        overallScore: validated.overall_score,
        skillsMatchScore: validated.breakdown.skills_match,
        experienceRelevanceScore: validated.breakdown.experience_relevance,
        educationScore: validated.breakdown.education,
        matchedKeywords: validated.matched_keywords,
        missingKeywords: validated.missing_keywords,
        suggestions: validated.suggestions as Suggestion[],
        summary: validated.summary,
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
