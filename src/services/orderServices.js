import createHttpError from 'http-errors';

import { OrderModel } from '../models/orderModel.js';
import { ClientModel } from '../models/clientModel.js';

import { SORT_ORDER } from '../constants/constants.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { logOrderHistory } from '../utils/logOrderHistory.js';
import { checkOrderExists } from '../utils/checkOrderExist.js';
import { sortOrders } from '../utils/parseSortParams.js';

export const getAllOrdersService = async ({
  page = 1,
  perPage = 10,
  sortBy = 'createdAt',
  sortOrder = SORT_ORDER.DESC,
  filter = {},
}) => {
  const limitValue = Number(perPage);
  const skipValue = (Number(page) - 1) * limitValue;

  const { client, ...otherFilters } = filter;
  const cleanFilter = Object.fromEntries(
    Object.entries(otherFilters).filter(([, value]) => value !== undefined),
  );

  const pipeline = [
    { $match: { ...cleanFilter, status: { $ne: 'FINISHED' } } },
    {
      $lookup: {
        from: 'clients',
        localField: 'client',
        foreignField: '_id',
        as: 'client',
      },
    },
    { $unwind: { path: '$client', preserveNullAndEmptyArrays: true } },
  ];

  if (client) {
    pipeline.push({
      $match: {
        'client.name': { $regex: client, $options: 'i' },
      },
    });
  }

  let orders = await OrderModel.aggregate(pipeline);

  orders = orders.map((order) => {
    const falta = (order.items || [])
      .filter((item) => item.status !== 'FINISHED')
      .reduce((total, item) => total + Number(item.quantity || 0), 0);

    return { ...order, falta };
  });

  orders = sortOrders(orders, sortBy, sortOrder);

  const ordersCount = orders.length;
  const paginatedOrders = orders.slice(skipValue, skipValue + limitValue);
  const paginationData = calculatePaginationData(ordersCount, page, perPage);

  return { data: paginatedOrders, ...paginationData };
};

export const getOrderByIdService = async (orderId) => {
  const order = await OrderModel.findById(orderId)
    .populate('client')
    .populate('owner', 'name')
    .lean();
  if (!order) {
    throw createHttpError(404, 'Order not found!');
  }
  return order;
};

export const createOrderService = async (payload, userId) => {
  const { EP, client } = payload;

  const exists = await checkOrderExists(EP, client);
  if (exists.exists) {
    throw createHttpError(409, 'Order with this EP and client already exists');
  }

  let clientId = client;
  if (typeof client === 'string') {
    const foundClient = await ClientModel.findOne({ name: client });
    if (!foundClient) throw createHttpError(400, 'Invalid client name');
    clientId = foundClient._id;
  }

  const newOrder = await OrderModel.create({
    ...payload,
    client: clientId,
    owner: userId,
  });

  await newOrder.populate('client');

  await logOrderHistory({
    orderId: newOrder._id,
    action: 'ORDER_CREATED',
    changedBy: userId,
    changes: {
      EP: newOrder.EP,
      client: newOrder.client,
      itemsCount: newOrder.items.length,
      unitsCount: newOrder.items.reduce((sum, item) => sum + item.quantity, 0),
    },
  });

  for (const item of newOrder.items) {
    await logOrderHistory({
      orderId: newOrder._id,
      itemId: item._id,
      action: 'ITEM_ADDED_TO_ORDER',
      changedBy: userId,
      changes: {
        EP: newOrder.EP,
        category: item.category,
        type: item.type,
        temper: item.temper,
        sizeX: item.sizeX,
        sizeY: item.sizeY,
        sizeZ: item.sizeZ,
        quantity: item.quantity,
        reason: item.reason,
      },
    });
  }

  return { order: newOrder };
};

export const mergeOrderService = async (payload, userId) => {
  const { exists, order } = await checkOrderExists(payload.EP, payload.client);
  if (!exists) throw createHttpError(404, 'Order not found for merge');

  let itemsToAdd = [];
  if (payload.items && payload.items.length > 0) {
    itemsToAdd = payload.items.map((i) => ({
      ...i,
      status: 'CREATED',
    }));
    order.items.push(...itemsToAdd);
  }

  await order.save();
  await order.populate('client');

  await logOrderHistory({
    orderId: order._id,
    action: 'ITEM_ADDED',
    changedBy: userId,
    changes: {
      EP: order.EP,
      addedItemsCount: payload.items.length || 0,
      addedItems: payload.items.map((i) => ({
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

  if (payload.client) {
    if (typeof payload.client === 'string') {
      const client = await ClientModel.findOne({ name: payload.client });
      if (!client) throw createHttpError(400, 'Invalid client name');
      payload.client = client._id;
    } else if (typeof payload.client === 'object' && payload.client._id) {
      payload.client = payload.client._id;
    } else {
      throw createHttpError(400, 'Invalid client data');
    }
  }

  const isItemsInWork = oldOrder.items.some(
    (item) => item.status === 'IN_PROGRESS' || item.status === 'FINISHED',
  );

  if (isItemsInWork && payload.items) {
    throw createHttpError(
      403,
      "Can't edit order with item status 'In progress' or 'Finished'",
    );
  }

  const allowedFields = ['EP', 'client', 'local'];
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
      status: 'CREATED',
    }));
    updateOps.$push = { items: { $each: itemsToAdd } };
  }

  const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateOps, {
    new: true,
  }).populate('client');

  const changes = {};

  for (const key in setData) {
    if (key === 'client') {
      const oldClientId =
        oldOrder.client?._id?.toString() || oldOrder.client?.toString();
      const newClientId =
        updatedOrder.client?._id?.toString() || updatedOrder.client?.toString();
      if (oldClientId !== newClientId) {
        const oldClient = await ClientModel.findById(oldClientId);
        const newClient = await ClientModel.findById(newClientId);
        changes.client = {
          old: oldClient?.name || oldClientId,
          new: newClient?.name || newClientId,
        };
      }
    } else {
      if (JSON.stringify(oldOrder[key]) !== JSON.stringify(updatedOrder[key])) {
        changes[key] = { old: oldOrder[key], new: updatedOrder[key] };
      }
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
      action: 'ORDER_EDITED',
      changedBy: userId,
      changes: {
        displayEP: updatedOrder.EP,
        ...changes,
      },
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

  if (oldItem.status === 'IN_PROGRESS') {
    throw createHttpError(403, "Can't edit item with status 'In progress'");
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
  ).populate('client');

  const changes = {};
  for (const key of allowedFields) {
    const updatedValue = updatedOrder.items.find(
      (i) => i._id.toString() === itemId,
    )[key];
    if (JSON.stringify(oldItem[key]) !== JSON.stringify(updatedValue)) {
      changes[key] = { old: oldItem[key], new: updatedValue };
    }
  }

  if (!('category' in changes)) {
    changes.category = oldItem.category;
  }
  if (!('type' in changes)) {
    changes.type = oldItem.type;
  }

  if (Object.keys(changes).length > 0) {
    await logOrderHistory({
      orderId,
      itemId,
      action: 'ITEM_EDITED',
      changedBy: userId,
      changes: {
        EP: oldOrder.EP,
        ...changes,
      },
    });
  }

  return updatedOrder;
};

export const deleteOrderService = async (orderId, userId) => {
  const orderToDelete = await OrderModel.findById(orderId);
  if (!orderToDelete) {
    throw createHttpError(404, 'Order not found!');
  }

  await logOrderHistory({
    orderId: orderToDelete._id,
    action: 'ORDER_DELETED',
    changedBy: userId,
    changes: {
      EP: orderToDelete.EP,
    },
  });

  await OrderModel.findOneAndDelete({ _id: orderId });

  return orderToDelete;
};

export const deleteOrderItemService = async (orderId, itemId, userId) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw createHttpError(404, 'Order not found');

  const deletedItem = order.items.find((i) => i._id.toString() === itemId);
  if (!deletedItem) throw createHttpError(404, 'Item not found');

  await logOrderHistory({
    orderId,
    itemId,
    action: 'ITEM_DELETED',
    changedBy: userId,
    changes: {
      EP: order.EP,
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
  ).populate('client');

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

  if (oldItem.status === newStatus) return await order.populate('client');

  const updatedOrder = await OrderModel.findOneAndUpdate(
    { _id: orderId, 'items._id': itemId },
    { $set: { 'items.$.status': newStatus } },
    { new: true },
  ).populate('client');

  await logOrderHistory({
    orderId,
    itemId,
    action: 'STATUS_OF_ITEM_CHANGED',
    changedBy: userId,
    changes: {
      EP: order.EP,
      status: { old: oldItem.status, new: newStatus },
    },
  });

  const itemStatuses = updatedOrder.items.map((i) => i.status);
  const allDone = itemStatuses.every((s) => s === 'FINISHED');
  const anyInProduction = itemStatuses.some((s) => s === 'IN_PROGRESS');
  const currentOrderStatus = updatedOrder.status;

  let newOrderStatus = currentOrderStatus;

  if (allDone) {
    newOrderStatus = 'FINISHED';
  } else if (anyInProduction && currentOrderStatus !== 'FINISHED') {
    newOrderStatus = 'IN_PROGRESS';
  }

  if (newOrderStatus !== currentOrderStatus) {
    updatedOrder.status = newOrderStatus;
    await updatedOrder.save();

    await logOrderHistory({
      orderId,
      action: 'STATUS_OF_ORDER_CHANGED',
      changedBy: userId,
      changes: {
        EP: order.EP,
        status: { old: currentOrderStatus, new: newOrderStatus },
      },
    });
  }

  return updatedOrder;
};
