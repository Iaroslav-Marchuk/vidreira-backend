import { Router } from 'express';

import orderRouter from './ordersRoutes.js';
import authRouter from './authRoutes.js';
import historyRouter from './historyRoutes.js';
import clientsRouter from './clientsRoutes.js';
import rolesRouter from './rolesRoutes.js';
import archiveRouter from './archiveRoutes.js';

const router = Router();

router.use('/orders', orderRouter);
router.use('/archive', archiveRouter);
router.use('/auth', authRouter);
router.use('/history', historyRouter);
router.use('/clients', clientsRouter);
router.use('/roles', rolesRouter);

export default router;
