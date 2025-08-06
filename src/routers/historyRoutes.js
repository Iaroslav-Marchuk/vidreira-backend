import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { getOrderHistoryController } from '../controllers/historyControllers.js';

const router = Router();

router.get('/:orderId', isValidId, ctrlWrapper(getOrderHistoryController));

export default router;
