import { Router } from 'express';

import {
  createOrderController,
  deleteOrderController,
  getAllOrdersController,
  getOrderByIdController,
  replaceOrderController,
  updateOrderController,
  updateStatusController,
} from '../controllers/ordersControllers.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createOrderSchema,
  updateOrderSchema,
} from '../validation/orderValidarion.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticante } from '../middlewares/authenticante.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/constants.js';
import { checkRoleUpdateStatus } from '../middlewares/checkRoleUpdateStatus.js';

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

router.patch(
  '/:orderId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  validateBody(updateOrderSchema),
  ctrlWrapper(updateOrderController),
);

router.patch(
  '/:orderId/status',
  isValidId,
  checkRoleUpdateStatus,
  ctrlWrapper(updateStatusController),
);

router.put(
  '/:orderId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  validateBody(createOrderSchema),
  ctrlWrapper(replaceOrderController),
);

router.delete(
  '/:orderId',
  checkRoles([ROLES.DUPLO]),
  isValidId,
  ctrlWrapper(deleteOrderController),
);

export default router;
