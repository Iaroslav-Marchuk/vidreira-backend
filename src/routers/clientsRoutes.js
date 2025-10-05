import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getAllClientsController } from '../controllers/clientsController.js';
import { authenticante } from '../middlewares/authenticante.js';

const router = Router();

router.use(authenticante);

router.get('/clients', ctrlWrapper(getAllClientsController));

export default router;
