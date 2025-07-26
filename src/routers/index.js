import { Router } from 'express';

import orderRouter from './ordersRoutes.js';
import authRouter from './authRoutes.js';

const router = Router();

router.use('/orders', orderRouter);
router.use('/auth', authRouter);

export default router;
