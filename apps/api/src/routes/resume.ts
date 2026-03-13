import { Router } from 'express';
import upload from '../config/multer';
import { resumeHandler } from '../controllers/resume';

const router: Router = Router();

router.route('/upload').post(upload.single('resume'), resumeHandler);

export default router;
