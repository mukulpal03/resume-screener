import { db, usersTable, eq } from '@repo/db';

export async function getUserByClerkId(clerkId: string) {
  try {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId),
    });
  } catch (error) {
    console.error('Failed to load user by clerk id:', error);
    throw new Error('Failed to load user', { cause: error });
  }
}
