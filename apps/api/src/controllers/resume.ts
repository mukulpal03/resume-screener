import { Request, Response } from 'express';
import extractText from '../utils/extractFileContent';
import { analyzeResume, saveResult } from '../services/resume';
import { getAuth } from '@clerk/express';
import { getUserByClerkId } from '../services/user';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';

export const resumeHandler = asyncHandler(async (req: Request, res: Response) => {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    throw new UnauthorizedError();
  }

  const user = await getUserByClerkId(clerkId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  let text: string;
  try {
    text = await extractText(req.file);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read file';
    throw new BadRequestError(message);
  }

  const jobDescription = typeof req.body.jobDescription === 'string' ? req.body.jobDescription : '';

  const result = await analyzeResume(text, jobDescription);

  const saved = await saveResult(user.id, result, text, jobDescription);

  return res.status(200).json({
    success: true,
    characters: text.length,
    result,
    resultId: saved.id,
  });
});
