import { Router } from 'express';

import orderRouter from './ordersRoutes.js';
import authRouter from './authRoutes.js';
import historyRouter from './historyRoutes.js';
import clientsRouter from './clientsRoutes.js';
import rolesRouter from './rolesRoutes.js';
import archiveRouter from './archiveRoutes.js';
import statsRouter from './statsRouters.js';
import glassRouter from './glassRoutes.js';

const router = Router();

router.use('/orders', orderRouter);
router.use('/archive', archiveRouter);
router.use('/auth', authRouter);
router.use('/history', historyRouter);
router.use('/clients', clientsRouter);
router.use('/roles', rolesRouter);
router.use('/stats', statsRouter);
router.use('/glass', glassRouter);

export default router;
