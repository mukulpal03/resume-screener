import express, { Express } from 'express';
import cors from 'cors';
import { corsOptions } from './utils/cors';
import resumeRouter from './routes/resume';
import webhookRouter from './routes/webhook';
import { clerkMiddleware } from '@clerk/express';

const app: Express = express();

// IMPORTANT: Clerk (Svix) webhook verification requires the raw request body.
// Mount webhook routes BEFORE the global JSON body parser so `express.raw()` can read the body.
app.use('/webhook', webhookRouter);

// Populates `req.auth` (used by getAuth) from cookies/headers.
app.use(clerkMiddleware());

app.use(express.json());
app.use(cors(corsOptions));

app.use('/resume', resumeRouter);

export default app;
