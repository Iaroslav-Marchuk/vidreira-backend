import createHttpError from 'http-errors';

import {
  createOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderByIdService,
  replaceOrderService,
  updateOrderService,
  updateStatusService,
} from '../services/orderServices.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getAllOrdersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const orders = await getAllOrdersService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Succsessfully found orders!',
    orders,
  });
};

export const getOrderByIdController = async (req, res) => {
  const { orderId } = req.params;
  const order = await getOrderByIdService(orderId);

  if (!order) {
    throw createHttpError(404, 'Order not found!');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found product with id ${orderId}!`,
    order,
  });
};

export const createOrderController = async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const userId = req.user._id;

  payload.local.operator = user.name;

  const newOrder = await createOrderService(payload, userId);

  res.status(201).json({
    status: 201,
    message: 'Successfully created new order!',
    newOrder,
  });
};

export const deleteOrderController = async (req, res, next) => {
  const { orderId } = req.params;

  const orderToDelete = await deleteOrderService(orderId);

  if (!orderToDelete) {
    next(createHttpError(404, 'Order not found'));
    return;
  }

  res.status(204).send();
};

export const replaceOrderController = async (req, res) => {
  const { orderId } = req.params;
  const payload = req.body;
  const userId = req.user._id;
  const user = req.user;

  payload.local.operator = user.name;

  const { upsertedValue, updatedExisting } = await replaceOrderService(
    orderId,
    payload,
    userId,
  );

  if (updatedExisting === true) {
    return res.json({
      status: 200,
      message: 'Successfully upserted order!',
      data: upsertedValue,
    });
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created new order!',
    upsertedValue,
  });
};

export const updateOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  const payload = req.body;
  const userId = req.user._id;

  const updatedValue = await updateOrderService(orderId, payload, userId);

  if (!updatedValue) {
    next(createHttpError(404, 'Order not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched order!',
    updatedValue,
  });
};

export const updateStatusController = async (req, res, next) => {
  const { orderId } = req.params;
  const { status: newStatus } = req.body;
  const { role } = req.user;
  const userId = req.user._id;

  const updatedOrder = await updateStatusService(
    orderId,
    role,
    newStatus,
    userId,
  );

  if (!updatedOrder) {
    next(createHttpError(404, 'Order not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully updated status!',
    updatedOrder,
  });
};
