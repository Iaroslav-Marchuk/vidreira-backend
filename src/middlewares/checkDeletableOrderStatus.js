import createHttpError from 'http-errors';
import { OrderModel } from '../models/orderModel.js';

export const checkDeletableOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findById(orderId);

  if (!order) {
    next(createHttpError(404, 'Order not found'));
    return;
  }

  if (order.status === 'Em produção' || order.status === 'Concluído') {
    next(
      createHttpError(
        403,
        'You can’t delete an order with status "Em produção" or "Concluído"',
      ),
    );
    return;
  }

  next();
};
