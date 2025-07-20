import createHttpError from 'http-errors';
import {
  createOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderByIdService,
  replaceOrderService,
  updateOrderService,
} from '../services/order.services.js';

export const getAllOrdersController = async (req, res) => {
  const orders = await getAllOrdersService();
  res.json({
    status: 200,
    message: 'Succsessfully found orders!',
    data: orders,
  });
};

export const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;
  const order = await getOrderByIdService(orderId);

  if (!order) {
    throw createHttpError(404, 'Order not found!');
  }

  res.json({
    status: 200,
    message: `Successfully found product with id ${orderId}!`,
    data: order,
  });
};

export const createOrderController = async (req, res) => {
  const order = await createOrderService(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created new order!',
    data: order,
  });
};

export const updateOrderController = async (req, res) => {
  const { orderId } = req.params;

  const updatedOrder = await updateOrderService(orderId, req.body);

  if (!updatedOrder) {
    throw createHttpError(404, 'Order not found!');
  }

  res.json({
    status: 200,
    message: 'Successfully patched order!',
    data: updatedOrder,
  });
};

export const replaceOrderController = async (req, res, next) => {
  const { orderId } = req.params;

  const { upsertedOrder, updatedExisting } = await replaceOrderService(
    orderId,
    req.body,
  );

  if (updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Successfully upserted order!',
      data: upsertedOrder,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created new order!',
    data: upsertedOrder,
  });
};

export const deleteOrderController = async (req, res) => {
  const { orderId } = req.params;
  const orderToDelete = await deleteOrderService(orderId);

  if (!orderToDelete) {
    throw createHttpError(404, 'Order not found!');
  }

  res.status(204).send();
};
