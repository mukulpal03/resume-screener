import { Worker, Job } from 'bullmq';
import { redisPublisher, getBullMQConnection } from '../lib/redis';
import { ANALYSIS_QUEUE_NAME, AnalysisJobPayload } from '../queues/analysis.queue';
import { analyzeResume, saveResult } from '../services/resume';
import type { JobStatusEvent } from '@repo/types';

export function jobChannel(jobId: string): string {
  return `job:${jobId}`;
}

function publishStatus(jobId: string, event: JobStatusEvent): void {
  const data = JSON.stringify(event);

  redisPublisher
    .setex(`status:${jobId}`, 3600, data)
    .catch((err) => console.error(`[Worker] redis setex failed for job ${jobId}:`, err));

  redisPublisher
    .publish(jobChannel(jobId), data)
    .catch((err) => console.error(`[Worker] publish failed for job ${jobId}:`, err));
}

async function processAnalysisJob(job: Job<AnalysisJobPayload>): Promise<void> {
  const { userId, resumeText, jobDescription } = job.data;
  const jobId = job.id!;

  try {
    publishStatus(jobId, { status: 'analyzing' });
    await job.updateProgress(30);

    const result = await analyzeResume(resumeText, jobDescription);

    publishStatus(jobId, { status: 'saving' });
    await job.updateProgress(80);

    const saved = await saveResult(userId, result, resumeText, jobDescription);

    await job.updateProgress(100);
    publishStatus(jobId, { status: 'done', resultId: saved.id, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    publishStatus(jobId, { status: 'failed', error: message });
    throw error; // re-throw so BullMQ applies retry/backoff
  }
}

let workerInstance: Worker | null = null;

export function startAnalysisWorker(): Worker {
  if (workerInstance) return workerInstance;

  workerInstance = new Worker<AnalysisJobPayload>(ANALYSIS_QUEUE_NAME, processAnalysisJob, {
    connection: getBullMQConnection(),
    concurrency: 3,
  });

  workerInstance.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message);
  });

  workerInstance.on('error', (err) => {
    console.error('[Worker] error:', err.message);
  });

  console.info('[Worker] Analysis worker started');
  return workerInstance;
}

export async function stopAnalysisWorker(): Promise<void> {
  if (workerInstance) {
    await workerInstance.close();
    workerInstance = null;
  }
}
