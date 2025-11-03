import createHttpError from 'http-errors';
import {
  getOrderHistoryService,
  getUserHistoryService,
} from '../services/historyServices.js';

export const getOrderHistoryController = async (req, res) => {
  const { orderId } = req.params;
  const history = await getOrderHistoryService(orderId);

  if (!history || history.length === 0) {
    throw createHttpError(404, 'History not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found history for orderID ${orderId}`,
    history,
  });
};

export const getUserHistoryController = async (req, res) => {
  const userId = req.user._id;
  const userHistory = await getUserHistoryService(userId);

  if (!userHistory || userHistory.length === 0) {
    throw createHttpError(404, 'User history not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found history of user ${userId}`,
    userHistory,
  });
};
