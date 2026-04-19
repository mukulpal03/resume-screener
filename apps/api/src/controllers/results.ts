import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import { getUserByClerkId } from '../services/user';
import { fetchResultByIdForUser, fetchResultsHistoryForUser } from '../services/results';
import { asyncHandler } from '../utils/asyncHandler';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';

function parsePositiveIntegerParam(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || !/^\d+$/.test(raw)) {
    return null;
  }
  const n = Number.parseInt(raw, 10);
  return n > 0 ? n : null;
}

async function resolveAuthedDbUser(req: Request) {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    throw new UnauthorizedError();
  }

  const user = await getUserByClerkId(clerkId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}

export const getResultsHistory = asyncHandler(async (req: Request, res: Response) => {
  const user = await resolveAuthedDbUser(req);
  const history = await fetchResultsHistoryForUser(user.id);

  return res.status(200).json({ history });
});

export const getResultById = asyncHandler(async (req: Request, res: Response) => {
  const resultId = parsePositiveIntegerParam(req.params.id);
  if (resultId === null) {
    throw new BadRequestError('Invalid result id');
  }

  const user = await resolveAuthedDbUser(req);
  const result = await fetchResultByIdForUser(user.id, resultId);

  if (!result) {
    throw new NotFoundError('Result not found');
  }

  return res.status(200).json({ result });
});
