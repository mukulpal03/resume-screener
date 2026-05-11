import { Router } from 'express';
import upload from '../config/multer';
import { resumeHandler } from '../controllers/resume';
import { requireClerkAuth } from '../middleware/requireClerkAuth';
import { apiLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { analyzeResumeSchema } from '@repo/validation';

const router: Router = Router();

router
  .route('/upload')
  .post(
    apiLimiter,
    requireClerkAuth,
    upload.single('resume'),
    validate(analyzeResumeSchema),
    resumeHandler
  );

export default router;
