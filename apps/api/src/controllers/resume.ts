import { Request, Response } from 'express';
import extractText from '../utils/extractFileContent';

export const resumeHandler = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const text = await extractText(req.file);

  res.json({ success: true, characters: text.length, text });
};
