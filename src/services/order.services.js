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
  const result = await OrderModel.findByIdAndUpdate(orderId, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    replacedOrder: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
};

// export const updateStudent = async (studentId, payload, options = {}) => {
//   const rawResult = await StudentsCollection.findOneAndUpdate(
//     { _id: studentId },
//     payload,
//     {
//       new: true,
//       includeResultMetadata: true,
//       ...options,
//     },
//   );

//   if (!rawResult || !rawResult.value) return null;

//   return {
//     student: rawResult.value,
//     isNew: Boolean(rawResult?.lastErrorObject?.upserted),
//   };
// };

export const deleteOrderService = (orderId) => {
  return OrderModel.findByIdAndDelete(orderId);
};
