import type { Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { db, usersTable } from '@repo/db';

export const syncClerkUserController = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const user = await clerkClient.users.getUser(userId);

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return res.status(422).json({ success: false, message: 'Clerk user is missing an email' });
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sync Clerk user';
    // eslint-disable-next-line no-console
    console.error('syncClerkUserController error:', message);
    return res.status(500).json({ success: false, message });
  }
};
