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

const orderRouter = Router();

orderRouter.get('/', ctrlWrapper(getAllOrdersController));

orderRouter.get('/:orderId', ctrlWrapper(getOrderByIdController));

orderRouter.post('/', ctrlWrapper(createOrderController));

orderRouter.patch('/:orderId', ctrlWrapper(updateOrderController));

orderRouter.put('/:orderId', ctrlWrapper(replaceOrderController));

orderRouter.delete('/:orderId', ctrlWrapper(deleteOrderController));

export default orderRouter;
