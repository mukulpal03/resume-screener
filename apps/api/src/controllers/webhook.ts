import { Request, Response } from 'express';
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { WebhookEvent } from '@clerk/express';
import { db, eq, usersTable } from '@repo/db';

export const clerkWebhookController = async (req: Request, res: Response) => {
  // express.raw() outputs a Buffer, svix expects a string
  const body = (req.body as Buffer).toString('utf8');

  const svixHeaders = {
    'svix-id': req.header('svix-id'),
    'svix-timestamp': req.header('svix-timestamp'),
    'svix-signature': req.header('svix-signature'),
  } as const;

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let event: WebhookEvent;

  try {
    event = webhook.verify(body, svixHeaders as WebhookRequiredHeaders) as WebhookEvent;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Unknown error during webhook verification';
    // eslint-disable-next-line no-console
    console.error('Error verifying webhook:', errorMessage);
    return res.status(400).json({ success: false, message: errorMessage });
  }

  try {
    if (event.type === 'user.created') {
      const { id, email_addresses, first_name, last_name } = event.data;

      await db
        .insert(usersTable)
        .values({
          clerkId: id as string,
          firstName: first_name as string,
          lastName: last_name as string,
          email: email_addresses?.[0]?.email_address as string,
        })
        // to avoid the race condition
        .onConflictDoUpdate({
          target: usersTable.clerkId, // If this clerkId already exists...
          set: {
            // ...just update the record instead of crashing!
            firstName: first_name as string,
            lastName: last_name as string,
            email: email_addresses?.[0]?.email_address as string,
          },
        });
    }

    if (event.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = event.data;

      await db
        .update(usersTable)
        .set({
          clerkId: id as string,
          firstName: first_name as string,
          lastName: last_name as string,
          email: email_addresses?.[0]?.email_address as string,
        })
        .where(eq(usersTable.clerkId, id as string));
    }

    if (event.type === 'user.deleted') {
      const { id } = event.data;

      await db.delete(usersTable).where(eq(usersTable.clerkId, id as string));
    }
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Internal server error during webhook processing';
    // eslint-disable-next-line no-console
    console.error('Error processing database', errorMessage);
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }

  res.status(200).json({ success: true });
};
