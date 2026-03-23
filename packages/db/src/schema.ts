import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull().unique(),
  firstName: varchar().notNull(),
  lastName: varchar().notNull(),
  clerkId: varchar().notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
