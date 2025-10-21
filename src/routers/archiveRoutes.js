import { Router } from 'express';
import { authenticante } from '../middlewares/authenticante.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getArchiveController } from '../controllers/archiveControllers.js';

const router = Router();

router.use(authenticante);

router.get('/', ctrlWrapper(getArchiveController));

export default router;
