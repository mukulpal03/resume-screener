import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import { getUserByClerkId } from '../services/user';
import { fetchResultsHistoryForUser } from '../services/results';

export const getResultsHistory = async (req: Request, res: Response) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await getUserByClerkId(clerkId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const history = await fetchResultsHistoryForUser(user.id);

    return res.status(200).json({ history });
  } catch (error) {
    console.error('Error fetching results history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
