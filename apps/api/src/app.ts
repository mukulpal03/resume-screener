import express, { Express } from 'express';
import { clerkMiddleware } from '@clerk/express';
import webhookRouter from './routes/webhook';
import upload from './config/multer';
import extractText from './utils/extractFileContent';

const app: Express = express();

app.use(clerkMiddleware());

app.use('/webhook', webhookRouter);

app.use(express.json());

app.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const text = await extractText(req.file);
  console.log('Extracted text:\n', text);

  res.json({ success: true, characters: text.length });
});

export default app;
