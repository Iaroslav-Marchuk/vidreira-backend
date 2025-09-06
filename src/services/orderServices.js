import { OrderModel } from '../models/orderModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';
import createHttpError from 'http-errors';
import { logOrderHistory } from '../utils/logOrderHistory.js';

export const getAllOrdersService = async ({
  page,
  perPage,
  sortBy = 'createdAt',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limitValue = perPage;
  const skipValue = (page - 1) * perPage;

  const cleanFilter = Object.fromEntries(
    Object.entries(filter).filter(([, value]) => value !== undefined),
  );

  const ordersQuery = OrderModel.find(cleanFilter);

  const ordersCount = await OrderModel.find(cleanFilter)
    .merge(ordersQuery)
    .countDocuments();

  const orders = await ordersQuery
    .skip(skipValue)
    .limit(limitValue)
    .sort({ [sortBy]: sortOrder })
    .select(
      'EP cliente items.category items.type items.temper items.sizeX items.sizeY items.sizeZ items.quantity local.zona status createdAt',
    );

  const paginationData = calculatePaginationData(ordersCount, page, perPage);

  return { data: orders, ...paginationData };
};

export const getOrderByIdService = async (orderId) => {
  const order = await OrderModel.findById(orderId);
  return order;
};

export const createOrderService = async (payload, userId) => {
  const order = await OrderModel.create(payload);

  await logOrderHistory({
    orderId: order._id,
    action: 'created',
    changedBy: userId,
    changes: {
      EP: order.EP,
      cliente: order.cliente,
      status: order.status,
    },
  });

  return order;
};

export const deleteOrderService = async (orderId) => {
  return await OrderModel.findOneAndDelete({ _id: orderId });
};

export const replaceOrderService = async (orderId, payload, userId) => {
  const oldOrder = await OrderModel.findById(orderId);
  if (!oldOrder) {
    throw createHttpError(404, 'Order not found');
  }

  const result = await OrderModel.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  const newOrder = result.value;
  const changes = {};

  for (const key in payload) {
    if (JSON.stringify(oldOrder[key]) !== JSON.stringify(payload[key])) {
      changes[key] = {
        from: oldOrder[key],
        to: payload[key],
      };
    }
  }

  if (Object.keys(changes).length > 0) {
    await logOrderHistory({
      orderId,
      action: 'updated',
      changedBy: userId,
      changes,
    });
  }

  return {
    upsertedValue: newOrder,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
};

export const updateOrderService = async (orderId, payload, userId) => {
  const oldOrder = await OrderModel.findById(orderId);
  if (!oldOrder) {
    throw createHttpError(404, 'Order not found');
  }

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId },
    payload,
    {
      new: true,
    },
  );

  const changes = {};

  for (const key in payload) {
    if (JSON.stringify(oldOrder[key]) !== JSON.stringify(updatedOrder[key])) {
      changes[key] = {
        from: oldOrder[key],
        to: updatedOrder[key],
      };
    }
  }

  if (Object.keys(changes).length > 0) {
    await logOrderHistory({
      orderId,
      action: 'updated',
      changedBy: userId,
      changes,
    });
  }

  return updatedOrder;
};

export const updateStatusService = async (orderId, role, newStatus, userId) => {
  const order = await OrderModel.findById(orderId);

  if (!order) {
    throw createHttpError(404, 'Order not found!');
  }

  if (role === 'corte' && newStatus !== 'InProgress') {
    throw createHttpError(403, 'Corte can only set status to "In Progress"');
  }

  if (role === 'duplo' && newStatus === 'InProgress') {
    throw createHttpError(403, 'Duplo can not set status "In progress"');
  }

  const oldStatus = order.status;
  if (oldStatus === newStatus) {
    return order;
  }

  const updatedStatus = await OrderModel.findByIdAndUpdate(
    orderId,
    { status: newStatus },
    { new: true },
  );

  await logOrderHistory({
    orderId: order._id,
    action: 'updated status',
    changedBy: userId,
    changes: {
      status: {
        from: oldStatus,
        to: newStatus,
      },
    },
  });

  return updatedStatus;
};
