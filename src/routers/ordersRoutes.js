import { Router } from 'express';

import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  replaceOrderController,
  updateOrderController,
} from '../controllers/ordersControllers.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../validation/orderValidarion.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getAllOrdersController));

router.get('/:orderId', isValidId, ctrlWrapper(getOrderByIdController));

router.post(
  '/',
  validateBody(createOrderSchema),
  ctrlWrapper(createOrderController),
);

router.patch(
  '/:orderId',
  isValidId,
  validateBody(updateOrderSchema),
  ctrlWrapper(updateOrderController),
);

router.put(
  '/:orderId',
  isValidId,
  validateBody(createOrderSchema),
  ctrlWrapper(replaceOrderController),
);

router.delete('/:orderId', isValidId, ctrlWrapper(deleteOrderController));

export default router;
