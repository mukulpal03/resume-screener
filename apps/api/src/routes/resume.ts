import { Router } from 'express';
import upload from '../config/multer';
import { resumeHandler } from '../controllers/resume';
import { requireClerkAuth } from '../middleware/requireClerkAuth';
import { analysisLimiter } from '../middleware/rateLimiter';

const router: Router = Router();

router
  .route('/upload')
  .post(analysisLimiter, requireClerkAuth, upload.single('resume'), resumeHandler);

export default router;
