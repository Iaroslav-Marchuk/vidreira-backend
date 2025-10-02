import {
  createOrMergeOrderService,
  deleteOrderItemService,
  deleteOrderService,
  getAllOrdersService,
  getOrderByIdService,
  updateItemStatusService,
  updateOrderItemService,
  updateOrderService,
} from '../services/orderServices.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllOrdersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const orders = await getAllOrdersService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Succsessfully found orders!',
    orders,
  });
};

export const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;
  const order = await getOrderByIdService(orderId);

  res.status(200).json({
    status: 200,
    message: `Successfully found product with id ${orderId}!`,
    order,
  });
};

export const createOrMergeOrderController = async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const userId = req.user._id;

  payload.local.operator = user.name;

  const { order, created } = await createOrMergeOrderService(payload, userId);

  res.status(created ? 201 : 200).json({
    status: created ? 201 : 200,
    message: created
      ? 'Successfully created new order!'
      : 'Order updated successfully!',
    newOrder: order,
  });
};

export const updateOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  const payload = req.body;
  const userId = req.user._id;

  const updatedOrder = await updateOrderService(orderId, payload, userId);

  res.json({
    status: 200,
    message: 'Successfully updated order!',
    updatedOrder,
  });
};

export const updateOrderItemController = async (req, res, next) => {
  const { orderId, itemId } = req.params;
  const payload = req.body;
  const userId = req.user._id;

  const updatedOrder = await updateOrderItemService(
    orderId,
    itemId,
    payload,
    userId,
  );

  res.json({
    status: 200,
    message: 'Item updated successfully!',
    updatedOrder,
  });
};

export const deleteOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  await deleteOrderService(orderId);
  res.json({
    status: 200,
    message: 'Order deleted successfully!',
    orderId,
  });
};

// export const deleteOrderItemController = async (req, res, next) => {
//   const { orderId, itemId } = req.params;

//   await deleteOrderItemService(orderId, itemId);
//   res.status(204).send();
// };

// export const deleteOrderItemController = async (req, res, next) => {
//   const { orderId, itemId } = req.params;

//   try {
//     const result = await deleteOrderItemService(orderId, itemId);
//     res.status(200).json({
//       updatedOrder: result || null,
//       deletedEntireOrder: !result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteOrderItemController = async (req, res, next) => {
  const { orderId, itemId, userId } = req.params;

  const result = await deleteOrderItemService(orderId, itemId, userId);
  res.json({
    status: 200,
    message: 'Item deleted successfully!',
    deletedItemId: result.deletedItemId,
    updatedOrder: result.updatedOrder,
  });
};

export const updateItemStatusController = async (req, res, next) => {
  const { orderId, itemId } = req.params;
  const { status: newStatus } = req.body;
  const userId = req.user._id;

  const updatedOrder = await updateItemStatusService(
    orderId,
    itemId,
    newStatus,
    userId,
  );

  res.json({
    status: 200,
    message: 'Successfully updated status!',
    updatedOrder,
  });
};
