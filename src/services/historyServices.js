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

export const getUserHistoryService = async (userId) => {
  const userHistory = await OrderHistoryModel.find({ changedBy: userId })
    .populate('changedBy', 'name')
    .populate({
      path: 'orderId',
      select: 'EP',
      options: { strictPopulate: false },
    })
    .sort({ changedAt: -1 })
    .lean();
  return userHistory;
};
