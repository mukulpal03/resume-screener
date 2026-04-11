import { Router } from 'express';
import { getResultsHistory } from '../controllers/results';

const router: Router = Router();

router.get('/history', getResultsHistory);

export default router;
