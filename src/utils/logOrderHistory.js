import { OrderHistoryModel } from '../models/orderHistoryModel.js';

export const logOrderHistory = async ({
  orderId,
  itemId,
  action,
  changedBy,
  changes,
}) => {
  try {
    await OrderHistoryModel.create({
      orderId,
      itemId,
      action,
      changedBy,
      changedAt: new Date(),
      changes,
    });
  } catch (err) {
    console.error('Failed to log order history:', err);
  }
};
