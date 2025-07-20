import { SORT_ORDER } from '../constants/constants.js';
import { OrderModel } from '../models/order.model.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllOrdersService = async ({
  page = 1,
  perPage = 10,
  sortBy = 'createdAt',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const orderQuery = OrderModel.find(filter);
  const countOrders = await OrderModel.find()
    .merge(orderQuery)
    .countDocuments();
  const orders = await orderQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(countOrders, page, perPage);

  return {
    data: orders,
    ...paginationData,
  };
};

export const getOrderByIdService = (orderId) => {
  return OrderModel.findById(orderId);
};

export const createOrderService = (payload) => {
  return OrderModel.create(payload);
};

export const updateOrderService = (orderId, payload) => {
  return OrderModel.findByIdAndUpdate(orderId, payload, { new: true });
};

export const replaceOrderService = async (orderId, payload) => {
  const result = await OrderModel.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    upsertedOrder: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
};

export const deleteOrderService = (orderId) => {
  return OrderModel.findByIdAndDelete(orderId);
};
