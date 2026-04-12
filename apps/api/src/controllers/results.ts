import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import { getUserByClerkId } from '../services/user';
import { fetchResultByIdForUser, fetchResultsHistoryForUser } from '../services/results';

function parsePositiveIntegerParam(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined || !/^\d+$/.test(raw)) {
    return null;
  }
  const n = Number.parseInt(raw, 10);
  return n > 0 ? n : null;
}

async function resolveAuthedDbUser(req: Request, res: Response) {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const user = await getUserByClerkId(clerkId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return null;
  }

  return user;
}

export const getResultsHistory = async (req: Request, res: Response) => {
  try {
    const user = await resolveAuthedDbUser(req, res);
    if (!user) {
      return;
    }

    const history = await fetchResultsHistoryForUser(user.id);

    return res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching results history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getResultById = async (req: Request, res: Response) => {
  try {
    const resultId = parsePositiveIntegerParam(req.params.id);
    if (resultId === null) {
      return res.status(400).json({ error: 'Invalid result id' });
    }

    const user = await resolveAuthedDbUser(req, res);
    if (!user) {
      return;
    }

    const result = await fetchResultByIdForUser(user.id, resultId);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Error fetching result by id:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
