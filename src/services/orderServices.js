import { OrderModel } from '../models/orderModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';
import createHttpError from 'http-errors';
import { logOrderHistory } from '../utils/logOrderHistory.js';
import { ClientModel } from '../models/clientModel.js';
import { checkOrderExists } from '../utils/checkOrderExist.js';

export const getAllOrdersService = async ({
  page,
  perPage,
  sortBy = 'createdAt',
  sortOrder = SORT_ORDER.DESC,
  filter = {},
}) => {
  const limitValue = perPage;
  const skipValue = (page - 1) * perPage;

  const cleanFilter = Object.fromEntries(
    Object.entries(filter).filter(([, value]) => value !== undefined),
  );

  const ordersQuery = OrderModel.find(cleanFilter).populate('cliente');

  const ordersCount = await OrderModel.find(cleanFilter)
    .merge(ordersQuery)
    .countDocuments();

  const orders = await ordersQuery
    .skip(skipValue)
    .limit(limitValue)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData(ordersCount, page, perPage);

  return { data: orders, ...paginationData };
};

export const getOrderByIdService = async (orderId) => {
  const order = await OrderModel.findById(orderId).populate('cliente');
  if (!order) {
    throw createHttpError(404, 'Order not found!');
  }
  return order;
};

export const createOrderService = async (payload, userId) => {
  const { EP, cliente } = payload;

  const exists = await checkOrderExists(EP, cliente);
  if (exists.exists) {
    if (exists.exists) {
      throw createHttpError(
        409,
        'Order with this EP and client already exists',
      );
    }
  }

  let clientId = payload.cliente;
  if (typeof payload.cliente === 'string') {
    const client = await ClientModel.findOne({ name: payload.cliente });
    if (!client) throw createHttpError(400, 'Invalid client name');
    clientId = client._id;
  }

  const newOrder = await OrderModel.create({
    ...payload,
    cliente: clientId,
  });
  await newOrder.populate('cliente');

  await logOrderHistory({
    orderId: newOrder._id,
    action: 'Order Criado',
    changedBy: userId,
    changes: {
      EP: newOrder.EP,
      cliente: newOrder.cliente,
      itemsCount: newOrder.items.length,
    },
  });

  return { order: newOrder };
};

export const mergeOrderService = async (payload, userId) => {
  let clientId = payload.cliente;
  if (typeof payload.cliente === 'string') {
    const client = await ClientModel.findOne({ name: payload.cliente });
    if (!client) throw createHttpError(400, 'Invalid client name');
    clientId = client._id;
  }

  const { exists, order } = await checkOrderExists(payload.EP, clientId);
  if (!exists) throw createHttpError(404, 'Order not found for merge');

  if (payload.items && payload.items.length > 0) {
    const itemsToAdd = payload.items.map((i) => ({
      ...i,
      status: 'Criado',
    }));
    order.items.push(...itemsToAdd);
  }

  await order.save();
  await order.populate('cliente');

  await logOrderHistory({
    orderId: order._id,
    action: 'Order corrigido',
    changedBy: userId,
    changes: {
      addedItemsCount: payload.items?.length || 0,
      addedItems: payload.items?.map((i) => ({
        category: i.category,
        type: i.type,
        temper: i.temper,
        sizeX: i.sizeX,
        sizeY: i.sizeY,
        sizeZ: i.sizeZ,
        quantity: i.quantity,
      })),
    },
  });

  return { merged: true, order };
};

export const updateOrderService = async (orderId, payload, userId) => {
  const oldOrder = await OrderModel.findById(orderId);
  if (!oldOrder) throw createHttpError(404, 'Order not found');

  if (payload.cliente && typeof payload.cliente === 'string') {
    const client = await ClientModel.findOne({ name: payload.cliente });
    if (!client) throw createHttpError(400, 'Invalid client name');
    payload.cliente = client._id;
  }

  const isItemsInWork = oldOrder.items.some(
    (item) => item.status === 'Em produção' || item.status === 'Concluído',
  );

  if (isItemsInWork && payload.items) {
    throw createHttpError(
      403,
      "Can't edit order with item status 'Em produção' or 'Concluído'",
    );
  }

  const allowedFields = ['EP', 'cliente', 'local'];
  const updateOps = {};

  const setData = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      setData[key] = payload[key];
    }
  }
  if (Object.keys(setData).length > 0) {
    updateOps.$set = setData;
  }

  if (
    payload.items &&
    Array.isArray(payload.items) &&
    payload.items.length > 0
  ) {
    const itemsToAdd = payload.items.map((i) => ({
      ...i,
      status: 'Criado',
    }));
    updateOps.$push = { items: { $each: itemsToAdd } };
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateOps, {
    new: true,
  }).populate('cliente');

  const changes = {};
  for (const key in setData) {
    if (JSON.stringify(oldOrder[key]) !== JSON.stringify(updatedOrder[key])) {
      changes[key] = { old: oldOrder[key], new: updatedOrder[key] };
    }
  }

  if (payload.items && payload.items.length > 0) {
    changes.addedItemsCount = payload.items.length;
    changes.addedItems = payload.items.map((i) => ({
      category: i.category,
      type: i.type,
      temper: i.temper,
      sizeX: i.sizeX,
      sizeY: i.sizeY,
      sizeZ: i.sizeZ,
      quantity: i.quantity,
    }));
  }

  if (Object.keys(changes).length > 0) {
    await logOrderHistory({
      orderId,
      action: 'Order updated',
      changedBy: userId,
      changes,
    });
  }

  return updatedOrder;
};

export const updateOrderItemService = async (
  orderId,
  itemId,
  payload,
  userId,
) => {
  const oldOrder = await OrderModel.findById(orderId);
  if (!oldOrder) throw createHttpError(404, 'Order not found');

  const oldItem = oldOrder.items.find((i) => i._id.toString() === itemId);
  if (!oldItem) throw createHttpError(404, 'Item not found');

  if (oldItem.status === 'Em produção') {
    throw createHttpError(403, "Can't edit item with status 'Em produção'");
  }

  const allowedFields = [
    'category',
    'type',
    'temper',
    'sizeX',
    'sizeY',
    'sizeZ',
    'quantity',
    'reason',
  ];

  const updateItem = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      updateItem[`items.$.${key}`] = payload[key];
    }
  }

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId, 'items._id': itemId },
    { $set: updateItem },
    { new: true },
  ).populate('cliente');

  const changes = {};
  for (const key of allowedFields) {
    const updatedValue = updatedOrder.items.find(
      (i) => i._id.toString() === itemId,
    )[key];
    if (JSON.stringify(oldItem[key]) !== JSON.stringify(updatedValue)) {
      changes[key] = { old: oldItem[key], new: updatedValue };
    }
  }

  if (Object.keys(changes).length > 0) {
    await logOrderHistory({
      orderId,
      action: 'Artigo corrigido',
      changedBy: userId,
      changes,
    });
  }

  return updatedOrder;
};

export const deleteOrderService = async (orderId) => {
  const deletedOrder = await OrderModel.findOneAndDelete({ _id: orderId });
  if (!deletedOrder) {
    throw createHttpError(404, 'Order not found!');
  }
  return deletedOrder;
};

export const deleteOrderItemService = async (orderId, itemId, userId) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw createHttpError(404, 'Order not found');

  const deletedItem = order.items.find((i) => i._id.toString() === itemId);
  if (!deletedItem) throw createHttpError(404, 'Item not found');

  await logOrderHistory({
    orderId,
    itemId,
    action: 'Artigo eliminado',
    changedBy: userId,
    changes: {
      deletedItem: {
        category: deletedItem.category,
        type: deletedItem.type,
        temper: deletedItem.temper,
        sizeX: deletedItem.sizeX,
        sizeY: deletedItem.sizeY,
        sizeZ: deletedItem.sizeZ,
        quantity: deletedItem.quantity,
      },
    },
  });

  if (order.items.length === 1) {
    await deleteOrderService(orderId);
    return { deletedItemId: itemId };
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(
    orderId,
    { $pull: { items: { _id: itemId } } },
    { new: true },
  ).populate('cliente');

  return { updatedOrder: updatedOrder, deletedItemId: itemId };
};

export const updateItemStatusService = async (
  orderId,
  itemId,
  newStatus,
  userId,
) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw createHttpError(404, 'Order not found');

  const oldItem = order.items.find((i) => i._id.toString() === itemId);
  if (!oldItem) throw createHttpError(404, 'Item not found');

  if (oldItem.status === newStatus) return await order.populate('cliente');

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId, 'items._id': itemId },
    { $set: { 'items.$.status': newStatus } },
    { new: true },
  ).populate('cliente');

  await logOrderHistory({
    orderId,
    itemId,
    action: 'Estado mudado',
    changedBy: userId,
    changes: {
      status: { old: oldItem.status, new: newStatus },
    },
  });

  let newOrderStatus = updatedOrder.status;
  const itemStatuses = updatedOrder.items.map((i) => i.status);

  if (itemStatuses.every((s) => s === 'Concluído')) {
    newOrderStatus = 'Concluído';
  } else if (itemStatuses.some((s) => s === 'Em produção')) {
    newOrderStatus = 'Em produção';
  } else {
    newOrderStatus = 'Criado';
  }

  if (newOrderStatus !== updatedOrder.status) {
    updatedOrder.status = newOrderStatus;
    await updatedOrder.save();

    await logOrderHistory({
      orderId,
      action: 'Estado mudado',
      changedBy: userId,
      changes: {
        status: { old: order.status, new: newOrderStatus },
      },
    });
  }

  return updatedOrder;
};
