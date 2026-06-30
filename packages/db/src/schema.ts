import { integer, pgTable, timestamp, varchar, jsonb, text, boolean } from 'drizzle-orm/pg-core';

export interface Suggestion {
  section: 'Summary' | 'Experience' | 'Skills' | 'Projects' | 'Education';
  issue: string;
  fix: string;
}

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull().unique(),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  clerkId: varchar().notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const resultsTable = pgTable('results', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),

  jobTitle: varchar('job_title').notNull(),
  candidateName: varchar('candidate_name').notNull(),

  jobDescription: text('job_description').notNull(),
  resumeText: text('resume_text').notNull(),

  overallScore: integer('overall_score').notNull(),
  skillsMatchScore: integer('skills_match_score').notNull(),
  experienceRelevanceScore: integer('experience_relevance_score').notNull(),
  educationScore: integer('education_score').notNull(),

  matchedKeywords: varchar('matched_keywords').array(),
  missingKeywords: varchar('missing_keywords').array(),

  suggestions: jsonb('suggestions').$type<Suggestion[]>(),

  summary: text('summary').notNull(),
  isValid: boolean('is_valid').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
