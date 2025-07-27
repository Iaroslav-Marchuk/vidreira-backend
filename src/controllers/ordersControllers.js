import createHttpError from 'http-errors';

import {
  createOrderService,
  deleteOrderService,
  getAllOrdersService,
  getOrderByIdService,
  replaceOrderService,
  updateOrderService,
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
    data: orders,
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
  const { upsertedValue, updatedExisting } = await replaceOrderService(
    orderId,
    req.body,
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
    data: upsertedValue,
  });
};

export const updateOrderController = async (req, res, next) => {
  const { orderId } = req.params;
  const updatedValue = await updateOrderService(orderId, req.body);

  if (!updatedValue) {
    next(createHttpError(404, 'Order not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched order!',
    data: updatedValue,
  });
};
