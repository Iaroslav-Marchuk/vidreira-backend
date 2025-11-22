import createHttpError from 'http-errors';
import { OrderModel } from '../models/orderModel.js';

export const checkEditableStatus = async (req, res, next) => {
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

    if (item.status === 'IN_PROGRESS' || item.status === 'FINISHED') {
      return next(
        createHttpError(
          403,
          'You can’t edit an item with status "In progress" or "Finished"',
        ),
      );
    }
  } else {
    if (order.status === 'IN_PROGRESS' || order.status === 'FINISHED') {
      return next(
        createHttpError(
          403,
          'You can’t edit the order with status "In progress" or "Finished"',
        ),
      );
    }
  }

  next();
};
