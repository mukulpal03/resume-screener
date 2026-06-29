import { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import Redis from 'ioredis';
import extractText from '../utils/extractFileContent';
import { getUserMonthlyAnalysisCount } from '../services/resume';
import { getUserByClerkId } from '../services/user';
import { asyncHandler } from '../utils/asyncHandler';
import { analysisQueue } from '../queues/analysis.queue';
import { jobChannel } from '../workers/analysis.worker';
import { createRedisConnection, redisPublisher } from '../lib/redis';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  TooManyRequestsError,
  UnauthorizedError,
} from '../utils/errors';
import type { JobStatusEvent } from '@repo/types';

const MAX_MONTHLY_FREE = 5;

async function resolveAuthedUser(req: Request) {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) throw new UnauthorizedError();

  const user = await getUserByClerkId(clerkId);
  if (!user) throw new NotFoundError('User not found');

  return user;
}

export const enqueueAnalysisHandler = asyncHandler(async (req: Request, res: Response) => {
  const user = await resolveAuthedUser(req);

  if (!req.file) throw new BadRequestError('No file uploaded');

  // Text extraction must happen here — multer Buffers can't be serialised into Redis.
  let resumeText: string;
  try {
    resumeText = await extractText(req.file);
  } catch (err) {
    throw new BadRequestError(err instanceof Error ? err.message : 'Failed to read file');
  }

  const { jobDescription } = req.body;

  const usageCount = await getUserMonthlyAnalysisCount(user.id);

  if (usageCount >= MAX_MONTHLY_FREE) {
    throw new TooManyRequestsError(
      `Monthly analysis quota reached (${usageCount}/${MAX_MONTHLY_FREE}). Your limit resets at the start of next month.`
    );
  }

  const job = await analysisQueue.add('analyze' as never, {
    userId: user.id,
    resumeText,
    jobDescription,
  });

  const initialEvent: JobStatusEvent = { status: 'queued' };
  await Promise.all([
    redisPublisher.setex(`status:${job.id}`, 3600, JSON.stringify(initialEvent)),
    redisPublisher.setex(`job-user:${job.id}`, 3600, String(user.id)),
  ]).catch((err) => console.error(`[API] redis setex failed for job ${job.id}:`, err));

  return res.status(202).json({ success: true, jobId: job.id });
});

export const streamJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const user = await resolveAuthedUser(req);

  const jobId = req.params['jobId'] as string;
  if (!jobId) throw new BadRequestError('Missing jobId');

  // Verify ownership of the job
  let isOwner = false;
  const cachedUserId = await redisPublisher.get(`job-user:${jobId}`).catch(() => null);
  if (cachedUserId) {
    isOwner = Number(cachedUserId) === user.id;
  } else {
    // Fallback: check BullMQ queue
    const job = await analysisQueue.getJob(jobId);
    if (job) {
      isOwner = job.data?.userId === user.id;
    }
  }

  if (!isOwner) {
    throw new ForbiddenError('You do not have permission to access this job status');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering
  res.flushHeaders();

  // Each SSE connection needs its own subscriber — never share across connections.
  const subscriber: Redis = createRedisConnection();
  const channel = jobChannel(jobId);
  let isClosed = false;
  let hasReceivedEvent = false;

  const cleanup = async () => {
    if (isClosed) return;
    isClosed = true;
    try {
      await subscriber.unsubscribe(channel);
      subscriber.disconnect();
    } catch {
      /* ignore */
    }
  };

  const sendEvent = (event: JobStatusEvent) => {
    if (!isClosed) res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  subscriber.on('message', async (_channel: string, message: string) => {
    try {
      const event: JobStatusEvent = JSON.parse(message);
      hasReceivedEvent = true;
      sendEvent(event);
      if (event.status === 'done' || event.status === 'failed') {
        await cleanup();
        res.end();
      }
    } catch (err) {
      console.error(`[SSE] Failed to parse event for job ${jobId}:`, err);
    }
  });

  await subscriber.subscribe(channel);

  const cached = await redisPublisher.get(`status:${jobId}`).catch(() => null);
  if (!hasReceivedEvent) {
    if (cached) {
      try {
        const event: JobStatusEvent = JSON.parse(cached);
        sendEvent(event);
        if (event.status === 'done' || event.status === 'failed') {
          await cleanup();
          res.end();
          return;
        }
      } catch {
        sendEvent({ status: 'queued' });
      }
    } else {
      sendEvent({ status: 'queued' });
    }
  }

  req.on('close', cleanup);
});
