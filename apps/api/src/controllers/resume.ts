import { Request, Response } from 'express';
import extractText from '../utils/extractFileContent';
import { analyzeResume, saveResult } from '../services/resume';
import { getAuth } from '@clerk/express';
import { getUserByClerkId } from '../services/user';

export const resumeHandler = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserByClerkId(clerkId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text: string;
    try {
      text = await extractText(req.file);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      return res.status(400).json({ error: message });
    }

    const jobDescription =
      typeof req.body.jobDescription === 'string' ? req.body.jobDescription : '';

    const result = await analyzeResume(text, jobDescription);

    await saveResult(user.id, result, text, jobDescription);

    return res.json({ success: true, characters: text.length, result });
  } catch (error) {
    console.error('Resume handler error:', error);

    if (error instanceof Error) {
      const { message } = error;
      const isUnprocessableResponse =
        message.startsWith('Validation failed') ||
        message.startsWith('No JSON object found') ||
        message.startsWith('Truncated or malformed JSON');

      if (isUnprocessableResponse) {
        return res.status(422).json({ error: message });
      }
      if (
        error.message === 'Failed to analyze resume' ||
        error.message === 'Failed to save result'
      ) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};
