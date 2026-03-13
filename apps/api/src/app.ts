import express, { Express } from 'express';
import { clerkMiddleware } from '@clerk/express';
import webhookRouter from './routes/webhook';

const app: Express = express();

app.use(clerkMiddleware());

app.use('/webhook', webhookRouter);

app.use(express.json());

export default app;
