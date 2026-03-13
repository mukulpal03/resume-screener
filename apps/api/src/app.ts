import express, { Express } from 'express';
import cors from 'cors';
import { corsOptions } from './utils/cors';
import resumeRouter from './routes/resume';

const app: Express = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/resume', resumeRouter);

export default app;
