import { db, usersTable, eq } from '@repo/db';
import { InternalServerError } from '../utils/errors';

export async function getUserByClerkId(clerkId: string) {
  try {
    return await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId),
    });
  } catch (error) {
    if (error instanceof InternalServerError) throw error;
    // eslint-disable-next-line no-console
    console.error('Failed to load user by clerk id:', error);
    throw new InternalServerError('Failed to load user');
  }
}
