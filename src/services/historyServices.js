import { HistoryModel } from '../models/historyModel.js';

export const getOrderHistoryService = async (orderId) => {
  const history = await HistoryModel.find({ orderId })
    .populate('changedBy', 'name')
    .sort({
      changedAt: 1,
    });

  return history;
};
