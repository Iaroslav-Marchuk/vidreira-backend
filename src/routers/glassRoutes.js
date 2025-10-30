import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getGlassOptionsController } from '../controllers/glassControllers.js';

const router = Router();

router.get('/', ctrlWrapper(getGlassOptionsController));

export default router;
