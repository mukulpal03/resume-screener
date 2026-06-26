import express, { Express } from 'express';
import cors from 'cors';
import { corsOptions } from './utils/cors';
import resumeRouter from './routes/resume';
import webhookRouter from './routes/webhook';
import resultsRouter from './routes/results';
import { clerkMiddleware } from '@clerk/express';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { startAnalysisWorker, stopAnalysisWorker } from './workers/analysis.worker';

import { env } from './config/env';

const app: Express = express();

// Webhook routes must be mounted before express.json() — Svix needs the raw body.
app.use('/webhook', webhookRouter);

app.use(cors(corsOptions));
app.use(apiLimiter);

app.use(
  clerkMiddleware({ secretKey: env.CLERK_SECRET_KEY, publishableKey: env.CLERK_PUBLISHABLE_KEY })
);
app.use(express.json());

app.use('/resume', resumeRouter);
app.use('/results', resultsRouter);

app.use(errorHandler);

startAnalysisWorker();

const shutdown = async (signal: string) => {
  console.info(`[App] ${signal} received — shutting down`);
  await stopAnalysisWorker();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
