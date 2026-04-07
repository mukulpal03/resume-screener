import { integer, pgTable, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';

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
  userId: integer().references(() => usersTable.id),
  jobDescription: varchar().notNull(),
  resumeText: varchar().notNull(),
  overallScore: integer().notNull(),
  skillsMatchScore: integer().notNull(),
  experienceRelevanceScore: integer().notNull(),
  educationScore: integer().notNull(),
  matchedKeywords: varchar().array(),
  missingKeywords: varchar().array(),
  suggestions: jsonb('suggestions').array(),
  summary: varchar().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
