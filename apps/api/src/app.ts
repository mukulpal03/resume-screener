import express, { Express } from 'express';
import cors from 'cors';
import { corsOptions } from './utils/cors';
import resumeRouter from './routes/resume';
import webhookRouter from './routes/webhook';
import authRouter from './routes/auth';
import resultsRouter from './routes/results';
import { clerkMiddleware } from '@clerk/express';

const app: Express = express();

// IMPORTANT: Clerk (Svix) webhook verification requires the raw request body.
// Mount webhook routes BEFORE the global JSON body parser so `express.raw()` can read the body.
app.use('/webhook', webhookRouter);

// CORS should run before auth checks so browser preflight succeeds.
app.use(cors(corsOptions));

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;

if (!clerkSecretKey) {
  throw new Error('Missing CLERK_SECRET_KEY in API environment');
}
if (!clerkPublishableKey) {
  throw new Error('Missing CLERK_PUBLISHABLE_KEY in API environment');
}

// Populates `req.auth` (used by getAuth) from cookies/headers.
app.use(
  clerkMiddleware({
    secretKey: clerkSecretKey,
    publishableKey: clerkPublishableKey,
  })
);

app.use(express.json());

app.use('/resume', resumeRouter);
app.use('/auth', authRouter);
app.use('/results', resultsRouter);

export default app;
