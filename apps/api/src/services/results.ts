import { db, resultsTable, eq, desc, and } from '@repo/db';
import { InternalServerError } from '../utils/errors';

export async function fetchResultsHistoryForUser(userId: number) {
  try {
    return await db
      .select({
        id: resultsTable.id,
        jobTitle: resultsTable.jobTitle,
        candidateName: resultsTable.candidateName,
        overallScore: resultsTable.overallScore,
        skillsMatchScore: resultsTable.skillsMatchScore,
        experienceRelevanceScore: resultsTable.experienceRelevanceScore,
        educationScore: resultsTable.educationScore,
        matchedKeywords: resultsTable.matchedKeywords,
        missingKeywords: resultsTable.missingKeywords,
        suggestions: resultsTable.suggestions,
        summary: resultsTable.summary,
        isValid: resultsTable.isValid,
        createdAt: resultsTable.createdAt,
      })
      .from(resultsTable)
      .where(eq(resultsTable.userId, userId))
      .orderBy(desc(resultsTable.createdAt));
  } catch (error) {
    if (error instanceof InternalServerError) throw error;
    // eslint-disable-next-line no-console
    console.error('Failed to load results history:', error);
    throw new InternalServerError('Failed to load results history');
  }
}

export async function fetchResultByIdForUser(userId: number, resultId: number) {
  try {
    const rows = await db
      .select({
        id: resultsTable.id,
        jobTitle: resultsTable.jobTitle,
        candidateName: resultsTable.candidateName,
        overallScore: resultsTable.overallScore,
        skillsMatchScore: resultsTable.skillsMatchScore,
        experienceRelevanceScore: resultsTable.experienceRelevanceScore,
        educationScore: resultsTable.educationScore,
        matchedKeywords: resultsTable.matchedKeywords,
        missingKeywords: resultsTable.missingKeywords,
        suggestions: resultsTable.suggestions,
        summary: resultsTable.summary,
        isValid: resultsTable.isValid,
        createdAt: resultsTable.createdAt,
      })
      .from(resultsTable)
      .where(and(eq(resultsTable.userId, userId), eq(resultsTable.id, resultId)))
      .limit(1);

    return rows[0] ?? null;
  } catch (error) {
    if (error instanceof InternalServerError) throw error;
    // eslint-disable-next-line no-console
    console.error('Failed to load result by id:', error);
    throw new InternalServerError('Failed to load result');
  }
}
