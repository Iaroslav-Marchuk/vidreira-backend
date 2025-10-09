import { OrderModel } from '../models/orderModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';
import createHttpError from 'http-errors';
import { logOrderHistory } from '../utils/logOrderHistory.js';
import { ClientModel } from '../models/clientModel.js';

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

export const createOrMergeOrderService = async (payload, userId) => {
  if (typeof payload.cliente === 'string') {
    const client = await ClientModel.findOne({ name: payload.cliente });
    if (!client) throw createHttpError(400, 'Invalid client name');
    payload.cliente = client._id;
  }

  let existingOrder = await OrderModel.findOne({ EP: payload.EP }).populate(
    'cliente',
  );

  if (!existingOrder) {
    const order = await OrderModel.create(payload);
    await order.populate('cliente');

    await logOrderHistory({
      orderId: order._id,
      action: 'Order Criado',
      changedBy: userId,
      changes: {
        EP: order.EP,
        cliente: order.cliente,
        itemsCount: order.items.length,
      },
    });

    return { order, created: true };
  } else {
    existingOrder.items.push(...payload.items);
    await existingOrder.save();

    await logOrderHistory({
      orderId: existingOrder._id,
      action: 'Order corrigido',
      changedBy: userId,
      changes: {
        addedItemsCount: payload.items.length,
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

    await existingOrder.populate('cliente');
    return { order: existingOrder, created: false };
  }
};

// export const updateOrderService = async (orderId, payload, userId) => {
//   const oldOrder = await OrderModel.findById(orderId);
//   if (!oldOrder) {
//     throw createHttpError(404, 'Order not found');
//   }

//   if (payload.cliente && typeof payload.cliente === 'string') {
//     const client = await ClientModel.findOne({ name: payload.cliente });
//     if (!client) throw createHttpError(400, 'Invalid client name');
//     payload.cliente = client._id;
//   }

//   const isItemsInWork = oldOrder.items.some(
//     (item) => item.status === 'Em produção' || item.status === 'Concluído',
//   );

//   if (isItemsInWork) {
//     throw createHttpError(
//       403,
//       "Can't edit order with item status 'Em produção' or 'Concluído'",
//     );
//   }

//   const allowedFields = ['EP', 'cliente', 'local'];
//   const updateData = {};
//   for (const key of allowedFields) {
//     if (payload[key] !== undefined) {
//       updateData[key] = payload[key];
//     }
//   }

//   const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, updateData, {
//     new: true,
//   }).populate('cliente');

//   const changes = {};

//   for (const key in updateData) {
//     if (JSON.stringify(oldOrder[key]) !== JSON.stringify(updatedOrder[key])) {
//       changes[key] = {
//         old: oldOrder[key],
//         new: updatedOrder[key],
//       };
//     }
//   }

//   if (Object.keys(changes).length > 0) {
//     await logOrderHistory({
//       orderId,
//       action: 'Order corrigido',
//       changedBy: userId,
//       changes,
//     });
//   }

//   return updatedOrder;
// };

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

  // копіюємо лише базові поля
  const allowedFields = ['EP', 'cliente', 'local'];
  const updateData = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      updateData[key] = payload[key];
    }
  }

  // ✅ додаємо айтеми тільки після allowedFields
  const updateOps = {};
  if (
    payload.items &&
    Array.isArray(payload.items) &&
    payload.items.length > 0
  ) {
    updateOps.$push = { items: { $each: payload.items } };
  }

  // якщо і updateData, і $push є — об'єднуємо
  const finalUpdate = { ...updateData, ...updateOps };

  const updatedOrder = await OrderModel.findByIdAndUpdate(
    orderId,
    finalUpdate,
    {
      new: true,
    },
  ).populate('cliente');

  const changes = {};

  for (const key in updateData) {
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
      action: 'Order corrigido',
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
