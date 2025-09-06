import createHttpError from 'http-errors';
import { getOrderHistoryService } from '../services/historyServices.js';

export const getOrderHistoryController = async (req, res) => {
  const { orderId } = req.params;
  const history = await getOrderHistoryService(orderId);

  if (!history) {
    throw createHttpError(404, 'History not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found history for orderID ${orderId}`,
    history,
  });
};
