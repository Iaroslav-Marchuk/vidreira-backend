import { HistoryModel } from '../models/historyModel.js';

export const logOrderHistory = async ({
  orderId,
  action,
  changedBy,
  changes,
}) => {
  await HistoryModel.create({
    orderId,
    action,
    changedBy,
    changedAt: new Date(),
    changes,
  });
};
