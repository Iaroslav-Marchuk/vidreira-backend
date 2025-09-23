import createHttpError from 'http-errors';
import { OrderModel } from '../models/orderModel.js';

export const checkDeletableStatus = async (req, res, next) => {
  const { orderId, itemId } = req.params;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(createHttpError(404, 'Order not found'));
  }

  if (itemId) {
    const item = order.items.find((i) => i._id.toString() === itemId);
    if (!item) {
      return next(createHttpError(404, 'Item not found'));
    }

    if (item.status === 'Em produção' || item.status === 'Concluído') {
      return next(
        createHttpError(
          403,
          'You can’t delete an item with status "Em produção" or "Concluído"',
        ),
      );
    }
  } else {
    if (order.status === 'Em produção' || order.status === 'Concluído') {
      return next(
        createHttpError(
          403,
          'You can’t delete an order with status "Em produção" or "Concluído"',
        ),
      );
    }
  }

  next();
};
