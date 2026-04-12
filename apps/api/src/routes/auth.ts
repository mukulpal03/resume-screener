import { Router } from 'express';
import { requireClerkAuth } from '../middleware/requireClerkAuth';
import { syncClerkUserController } from '../controllers/auth';

const router: Router = Router();

router.route('/sync').post(requireClerkAuth, syncClerkUserController);

export default router;
