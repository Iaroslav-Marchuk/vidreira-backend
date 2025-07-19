import { Router } from 'express';
import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  replaceOrderController,
  updateOrderController,
} from '../controllers/orders.controllers.js';

const router = Router();

router.get('/', getAllOrdersController);

router.get('/:orderId', getOrderByIdController);

router.post('/', createOrderController);

router.patch('/:orderId', updateOrderController);

router.put('/:orderId', replaceOrderController);

router.delete('/:orderId', deleteOrderController);

export default router;
