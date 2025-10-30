import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getStatsController } from '../controllers/statsControllers.js';

const router = Router();

router.get('/', ctrlWrapper(getStatsController));

export default router;
