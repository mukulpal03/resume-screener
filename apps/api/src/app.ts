import express, { Express } from 'express';
import { clerkMiddleware } from '@clerk/express';
import webhookRouter from './routes/webhook';
import cors from 'cors';
import { corsOptions } from './utils/cors';

const app: Express = express();

app.use(clerkMiddleware());

app.use('/webhook', webhookRouter);

app.use(express.json());
app.use(cors(corsOptions));

export default app;
