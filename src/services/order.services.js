import { OrderModel } from '../models/order.model.js';

export const getAllOrdersService = () => {
  return OrderModel.find();
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
