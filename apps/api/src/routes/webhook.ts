import { Router } from 'express';
import express from 'express';
import { clerkWebhookController } from 'src/controllers/webhook';

const router: Router = Router();

router.route('/clerk').post(express.raw({ type: 'application/json' }), clerkWebhookController);

export default router;
