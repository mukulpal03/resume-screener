import { getModel } from '../lib/llm';
import { ResumeResult } from '@repo/types';
import { db, resultsTable, Suggestion, and, gte, sql, eq } from '@repo/db';
import { InternalServerError, UnprocessableEntityError } from '../utils/errors';
import { systemPrompt } from '../utils/prompt';
import { llmOutputSchema } from '@repo/validation';

async function analyzeResume(resumeText: string, jdText: string): Promise<ResumeResult> {
  const initialPrompt = `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jdText}\n\nEvaluate and return JSON according to the schema.`;

  try {
    const model = await getModel();
    const structuredModel = model.withStructuredOutput(llmOutputSchema);

    const response = await structuredModel.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: initialPrompt },
    ]);

    return response as ResumeResult;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // eslint-disable-next-line no-console
    console.error(`[LLM] Analysis failed: ${message}`);
    throw new UnprocessableEntityError(
      'Failed to analyze resume. The AI output was inconsistent. Please try again.'
    );
  }
}

async function saveResult(
  userId: number,
  result: ResumeResult,
  resumeText: string,
  jobDescription: string
) {
  try {
    const validated = llmOutputSchema.parse(result);

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
        isValid: validated.is_valid,
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

async function getUserMonthlyAnalysisCount(userId: number): Promise<number> {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(resultsTable)
      .where(and(eq(resultsTable.userId, userId), gte(resultsTable.createdAt, startOfMonth)));

    return Number(result[0]?.count || 0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to get monthly analysis count:', error);
    throw new InternalServerError('Failed to check usage quota');
  }
}

export { analyzeResume, saveResult, getUserMonthlyAnalysisCount };
