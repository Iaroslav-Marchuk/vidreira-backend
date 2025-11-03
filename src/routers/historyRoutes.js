import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  getOrderHistoryController,
  getUserHistoryController,
} from '../controllers/historyControllers.js';
import { authenticante } from '../middlewares/authenticante.js';

const router = Router();

router.use(authenticante);

router.get(
  '/order/:orderId',
  isValidId,
  ctrlWrapper(getOrderHistoryController),
);
router.get('/user', authenticante, ctrlWrapper(getUserHistoryController));

export default router;
