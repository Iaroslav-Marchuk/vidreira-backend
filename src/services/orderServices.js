import { OrderModel } from '../models/orderModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';
import createHttpError from 'http-errors';

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
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(ordersCount, page, perPage);

  return { data: orders, ...paginationData };
};

export const getOrderByIdService = async (orderId) => {
  const order = await OrderModel.findById(orderId);
  return order;
};

export const createOrderService = async (payload) => {
  const order = await OrderModel.create(payload);
  return order;
};

export const deleteOrderService = async (orderId) => {
  return await OrderModel.findOneAndDelete({ _id: orderId });
};

export const replaceOrderService = async (orderId, payload) => {
  const result = await OrderModel.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    upsertedValue: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
};

export const updateOrderService = async (orderId, payload) => {
  const updatedOrder = OrderModel.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
  });

  return updatedOrder;
};

export const updateStatusService = async (orderId, role, newStatus) => {
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

  return await OrderModel.findByIdAndUpdate(
    orderId,
    { status: newStatus },
    { new: true },
  );
};
