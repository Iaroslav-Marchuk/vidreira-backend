import { Router } from 'express';

import orderRouter from './ordersRoutes.js';
import authRouter from './authRoutes.js';
import historyRouter from './historyRoutes.js';
import recipeRouter from './recipesRoutes.js';

const router = Router();

router.use('/orders', orderRouter);
router.use('/auth', authRouter);
router.use('/history', historyRouter);

//це видалити після командного проекту
router.use('/recipes', recipeRouter);

export default router;
