import type { Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { db, usersTable } from '@repo/db';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError, UnprocessableEntityError } from '../utils/errors';

export const syncClerkUserController = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new UnauthorizedError();
  }

  const user = await clerkClient.users.getUser(userId);

  const email = user.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    throw new UnprocessableEntityError('Clerk user is missing an email');
  }

  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';

  const rows = await db
    .insert(usersTable)
    .values({
      clerkId: userId,
      email,
      firstName,
      lastName,
    })
    .onConflictDoUpdate({
      target: usersTable.clerkId,
      set: {
        email,
        firstName,
        lastName,
      },
    })
    .returning();

  return res.status(200).json({ success: true, user: rows[0] });
});
