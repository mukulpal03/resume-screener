import express, { Express } from 'express';
import { clerkMiddleware } from '@clerk/express';
import webhookRouter from './routes/webhook';
import upload from './config/multer';
import extractText from './utils/extractFileContent';
import cors from 'cors';
import { corsOptions } from './utils/cors';

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(clerkMiddleware());

app.use('/webhook', webhookRouter);

app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const text = await extractText(req.file);
  console.log('Extracted text:\n', text);

  res.json({ success: true, characters: text.length });
});

export default app;
