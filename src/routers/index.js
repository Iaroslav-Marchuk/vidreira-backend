import { Router } from 'express';

import orderRouter from './ordersRoutes.js';
import authRouter from './authRoutes.js';
import historyRouter from './historyRoutes.js';
import clientsRouter from './clientsRoutes.js';

const router = Router();

router.use('/orders', orderRouter);
router.use('/auth', authRouter);
router.use('/history', historyRouter);
router.use('/clients', clientsRouter);

export default router;
