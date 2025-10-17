import createHttpError from 'http-errors';
import { OrderModel } from '../models/orderModel.js';

export const checkOwner = async (req, res, next) => {
  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(createHttpError(404, 'Order not found'));
  }

  if (order.owner.toString() !== req.user._id.toString()) {
    return next(
      createHttpError(403, 'You can only edit or delete your own orders'),
    );
  }

  req.order = order;

  next();
};
