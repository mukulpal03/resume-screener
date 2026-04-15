import type { NextFunction, Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { UnauthorizedError } from '../utils/errors';

export function requireClerkAuth(req: Request, res: Response, next: NextFunction) {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new UnauthorizedError();
  }

  return next();
}
