import { Router } from 'express';

import orderRouter from './orders.routes.js';
import authRouter from './auth.routes.js';

const router = Router();

router.use('/orders', orderRouter);
router.use('/auth', authRouter);

export default router;
