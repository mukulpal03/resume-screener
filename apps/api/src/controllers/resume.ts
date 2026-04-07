import { Request, Response } from 'express';
import extractText from '../utils/extractFileContent';
import { analyzeResume, saveResult } from '../services/resume';

export const resumeHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const text = await extractText(req.file);

  const result = await analyzeResume(text, req.body.jobDescription || '');

  await saveResult(result, text, req.body.jobDescription || '');

  res.json({ success: true, characters: text.length, result });
};
