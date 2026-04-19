import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${req.method} ${req.url}:`, err);
  } else {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${req.method} ${req.url}: ${message}`);
  }

  const response: {
    success: boolean;
    error: {
      message: string;
      code?: string;
      stack?: string;
    };
  } = {
    success: false,
    error: {
      message,
    },
  };

  // Add stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
