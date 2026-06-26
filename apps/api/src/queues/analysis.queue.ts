import { Queue } from 'bullmq';
import { getBullMQConnection } from '../lib/redis';

export interface AnalysisJobPayload {
  userId: number;
  resumeText: string;
  jobDescription: string;
}

export const ANALYSIS_QUEUE_NAME = 'resume-analysis';

export const analysisQueue = new Queue<AnalysisJobPayload>(ANALYSIS_QUEUE_NAME, {
  connection: getBullMQConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});
