import { Router } from 'express';
import upload from '../config/multer';
import { enqueueAnalysisHandler, streamJobStatus } from '../controllers/resume';
import { requireClerkAuth } from '../middleware/requireClerkAuth';
import { apiLimiter } from '../middleware/rateLimiter';
import { validate } from '../middleware/validate';
import { analyzeResumeSchema } from '@repo/validation';

const router: Router = Router();

router
  .route('/analyze')
  .post(
    apiLimiter,
    requireClerkAuth,
    upload.single('resume'),
    validate(analyzeResumeSchema),
    enqueueAnalysisHandler
  );

router.route('/status/:jobId').get(requireClerkAuth, streamJobStatus);

export default router;
