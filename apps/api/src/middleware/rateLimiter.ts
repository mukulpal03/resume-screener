import { rateLimit } from 'express-rate-limit';
import { TooManyRequestsError } from '../utils/errors';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError('Too many requests, please try again later.'));
  },
});

export const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new TooManyRequestsError(
        'Rate limit exceeded for resume analysis. Please try again in 15 minutes.'
      )
    );
  },
});
