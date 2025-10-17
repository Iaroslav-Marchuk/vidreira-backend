import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getAllRolesController } from '../controllers/rolesControllers.js';

const router = Router();

router.get('/', ctrlWrapper(getAllRolesController));

export default router;
