import { Router } from 'express';
import { getResultById, getResultsHistory } from '../controllers/results';

const router: Router = Router();

router.get('/history', getResultsHistory);
router.get('/:id', getResultById);

export default router;
