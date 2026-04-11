import { db, resultsTable, eq, desc } from '@repo/db';

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
        createdAt: resultsTable.createdAt,
      })
      .from(resultsTable)
      .where(eq(resultsTable.userId, userId))
      .orderBy(desc(resultsTable.createdAt));
  } catch (error) {
    console.error('Failed to load results history:', error);
    throw new Error('Failed to load results history', { cause: error });
  }
}
