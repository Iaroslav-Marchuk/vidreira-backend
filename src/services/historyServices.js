import { OrderHistoryModel } from '../models/orderHistoryModel.js';

export const getOrderHistoryService = async (orderId) => {
  const history = await OrderHistoryModel.find({ orderId })
    .populate('changedBy', 'name')
    .sort({
      changedAt: 1,
    })
    .lean();

  return history;
};
