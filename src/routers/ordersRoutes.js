import { Router } from 'express';

import {
  createOrderController,
  deleteOrderController,
  deleteOrderItemController,
  getAllOrdersController,
  getOrderByIdController,
  mergeOrderController,
  updateItemStatusController,
  updateOrderController,
  updateOrderItemController,
} from '../controllers/ordersControllers.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createOrderSchema,
  mergeOrderSchema,
  updateOrderItemSchema,
  updateOrderSchema,
} from '../validation/orderValidarion.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticante } from '../middlewares/authenticante.js';
import { checkEditableStatus } from '../middlewares/checkEditableStatus.js';
import { checkDeletableStatus } from '../middlewares/checkDeletableStatus.js';
import { checkPermission } from '../middlewares/checkPermission.js';
import { checkOwner } from '../middlewares/checkOwner.js';
import { checkPermissionStatus } from '../middlewares/checkPermissionStatus.js';

const router = Router();

router.use(authenticante);

router.get('/', ctrlWrapper(getAllOrdersController));

router.get('/:orderId', isValidId, ctrlWrapper(getOrderByIdController));

router.post(
  '/',
  checkPermission('create'),
  validateBody(createOrderSchema),
  ctrlWrapper(createOrderController),
);

router.post(
  '/:orderId',
  checkPermission('edit'),
  checkOwner,
  isValidId,
  validateBody(mergeOrderSchema),
  ctrlWrapper(mergeOrderController),
);

router.patch(
  '/:orderId',
  checkPermission('edit'),
  checkOwner,
  isValidId,
  checkEditableStatus,
  validateBody(updateOrderSchema),
  ctrlWrapper(updateOrderController),
);

router.patch(
  '/:orderId/:itemId',
  checkPermission('edit'),
  checkOwner,
  isValidId,
  checkEditableStatus,
  validateBody(updateOrderItemSchema),
  ctrlWrapper(updateOrderItemController),
);

router.patch(
  '/:orderId/:itemId/status',
  isValidId,
  checkPermissionStatus,
  ctrlWrapper(updateItemStatusController),
);

router.delete(
  '/:orderId',
  checkPermission('delete'),
  checkOwner,
  isValidId,
  checkDeletableStatus,
  ctrlWrapper(deleteOrderController),
);

router.delete(
  '/:orderId/:itemId',
  checkPermission('delete'),
  checkOwner,
  isValidId,
  checkDeletableStatus,
  ctrlWrapper(deleteOrderItemController),
);

export default router;
