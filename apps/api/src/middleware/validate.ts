import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodIssue } from '@repo/validation';
import { BadRequestError } from '../utils/errors';

export const validate = <T>(schema: ZodSchema<T>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((iss: ZodIssue) => iss.message).join(', ');
      return next(new BadRequestError(message));
    }
    next();
  };
};
