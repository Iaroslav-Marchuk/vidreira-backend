import { Router } from 'express';

import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  replaceOrderController,
  updateOrderController,
} from '../controllers/orders.controllers.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../validation/order.validarion.js';
import { isValidId } from '../middlewares/isValidId.js';

const orderRouter = Router();

orderRouter.get('/', ctrlWrapper(getAllOrdersController));

orderRouter.get('/:orderId', isValidId, ctrlWrapper(getOrderByIdController));

orderRouter.post(
  '/',
  validateBody(createOrderSchema),
  ctrlWrapper(createOrderController),
);

orderRouter.patch(
  '/:orderId',
  isValidId,
  validateBody(updateOrderSchema),
  ctrlWrapper(updateOrderController),
);

orderRouter.put(
  '/:orderId',
  isValidId,
  validateBody(createOrderSchema),
  ctrlWrapper(replaceOrderController),
);

orderRouter.delete('/:orderId', isValidId, ctrlWrapper(deleteOrderController));

export default orderRouter;
