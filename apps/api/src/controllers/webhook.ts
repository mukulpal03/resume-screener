import { Request, Response } from 'express';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { WebhookEvent } from '@clerk/express';
import { db, eq, usersTable } from '@repo/db';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError, InternalServerError } from '../utils/errors';

import { env } from '../config/env';

export const clerkWebhookController = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line no-console
  console.log('\n--- [Webhook] Incoming Request ---');

  // express.raw() outputs a Buffer, svix expects a string
  const body = (req.body as Buffer).toString('utf8');

  const svixHeaders = {
    'svix-id': req.header('svix-id'),
    'svix-timestamp': req.header('svix-timestamp'),
    'svix-signature': req.header('svix-signature'),
  } as const;

  const webhookSecret = env.CLERK_WEBHOOK_SECRET;
  const webhook = new Webhook(webhookSecret);
  let event: WebhookEvent;

  try {
    event = webhook.verify(body, svixHeaders as WebhookRequiredHeaders) as WebhookEvent;
    // eslint-disable-next-line no-console
    console.log(`[Webhook] Signature verified! Event Type: ${event.type}`);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error during webhook verification';
    // eslint-disable-next-line no-console
    console.error(`[Webhook] ERROR: Signature verification failed.`, errorMessage);
    throw new BadRequestError(`Error verifying webhook: ${errorMessage}`);
  }

  try {
    if (event.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses?.[0]?.email_address as string;

      // eslint-disable-next-line no-console
      console.log(`[Webhook] Action: user.created - Upserting user in DB: ${id} (${email})`);

      await db
        .insert(usersTable)
        .values({
          clerkId: id as string,
          firstName: (first_name as string) || '',
          lastName: (last_name as string) || '',
          email: email,
        })
        .onConflictDoUpdate({
          target: usersTable.clerkId,
          set: {
            firstName: (first_name as string) || '',
            lastName: (last_name as string) || '',
            email: email,
          },
        });

      // eslint-disable-next-line no-console
      console.log(`[Webhook] Success: user.created complete.`);
    } else if (event.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses?.[0]?.email_address as string;

      // eslint-disable-next-line no-console
      console.log(`[Webhook] Action: user.updated - Updating user in DB: ${id} (${email})`);

      await db
        .update(usersTable)
        .set({
          firstName: (first_name as string) || '',
          lastName: (last_name as string) || '',
          email: email,
        })
        .where(eq(usersTable.clerkId, id as string));

      // eslint-disable-next-line no-console
      console.log(`[Webhook] Success: user.updated complete.`);
    } else if (event.type === 'user.deleted') {
      const { id } = event.data;

      // eslint-disable-next-line no-console
      console.log(`[Webhook] Action: user.deleted - Deleting user from DB: ${id}`);

      await db.delete(usersTable).where(eq(usersTable.clerkId, id as string));

      // eslint-disable-next-line no-console
      console.log(`[Webhook] Success: user.deleted complete.`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[Webhook] Event type ${event.type} ignored.`);
    }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error during database update';
    // eslint-disable-next-line no-console
    console.error(`[Webhook] ERROR: Database operation failed.`, errorMessage);
    throw new InternalServerError(`Error processing database: ${errorMessage}`);
  }

  // eslint-disable-next-line no-console
  console.log('[Webhook] Processing finished. Sending 200 OK.\n---');
  return res.status(200).json({ success: true });
});
