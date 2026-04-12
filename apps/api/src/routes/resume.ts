import { Router } from 'express';
import upload from '../config/multer';
import { resumeHandler } from '../controllers/resume';
import { requireClerkAuth } from '../middleware/requireClerkAuth';

const router: Router = Router();

router.route('/upload').post(requireClerkAuth, upload.single('resume'), resumeHandler);

export default router;
