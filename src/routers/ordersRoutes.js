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
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/constants.js';
import { checkEditableStatus } from '../middlewares/checkEditableStatus.js';
import { checkRoleUpdateStatus } from '../middlewares/checkRoleUpdateStatus.js';
import { checkDeletableStatus } from '../middlewares/checkDeletableStatus.js';

const router = Router();

router.use(authenticante);

router.get('/', ctrlWrapper(getAllOrdersController));

router.get('/:orderId', isValidId, ctrlWrapper(getOrderByIdController));

router.post(
  '/',
  checkRoles([ROLES.DUPLO]),
  validateBody(createOrderSchema),
  ctrlWrapper(createOrderController),
);

router.post(
  '/:orderId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  validateBody(mergeOrderSchema),
  ctrlWrapper(mergeOrderController),
);

router.patch(
  '/:orderId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  checkEditableStatus,
  validateBody(updateOrderSchema),
  ctrlWrapper(updateOrderController),
);

router.patch(
  '/:orderId/:itemId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  checkEditableStatus,
  validateBody(updateOrderItemSchema),
  ctrlWrapper(updateOrderItemController),
);

router.patch(
  '/:orderId/status',
  isValidId,
  checkRoleUpdateStatus,
  ctrlWrapper(updateItemStatusController),
);

router.delete(
  '/:orderId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  checkDeletableStatus,
  ctrlWrapper(deleteOrderController),
);

router.delete(
  '/:orderId/:itemId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  checkDeletableStatus,
  ctrlWrapper(deleteOrderItemController),
);

export default router;
