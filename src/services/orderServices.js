import { OrderModel } from '../models/orderModel.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/constants.js';

export const getAllOrdersService = async ({
  page,
  perPage,
  sortBy = 'createdAt',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
}) => {
  const limitValue = perPage;
  const skipValue = (page - 1) * perPage;

  const cleanFilter = Object.fromEntries(
    Object.entries(filter).filter(([, value]) => value !== undefined),
  );

  const ordersQuery = OrderModel.find(cleanFilter);

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

// export const getAllContacts = async ({
//   page,
//   perPage,
//   sortBy,
//   sortOrder,
//   filter,
//   userId,
// }) => {
//   const limitValue = perPage;
//   const skipValue = page > 0 ? (page - 1) * perPage : 0;

//   const contactQuery = ContactsCollection.find({ userId });

//   if (filter.contactType) {
//     contactQuery.where('contactType').equals(filter.contactType);
//   }

//   if (filter.isFavourite !== undefined) {
//     contactQuery.where('isFavourite').equals(filter.isFavourite);
//   }

//   const [totalCount, contacts] = await Promise.all([
//     ContactsCollection.find().merge(contactQuery).countDocuments(),

//     contactQuery
//       .sort({ [sortBy]: sortOrder })
//       .skip(skipValue)
//       .limit(limitValue),
//   ]);

//   const paginationData = calculatePaginationData(totalCount, page, perPage);

//   return { data: contacts, ...paginationData };
// };

export const getOrderByIdService = async (orderId) => {
  const order = await OrderModel.findById(orderId);
  return order;
};

export const createOrderService = async (payload) => {
  const order = await OrderModel.create(payload);
  return order;
};

export const deleteOrderService = async (orderId) => {
  return await OrderModel.findOneAndDelete({ _id: orderId });
};

export const replaceOrderService = async (orderId, payload) => {
  const result = await OrderModel.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });

  return {
    upsertedValue: result.value,
    updatedExisting: result.lastErrorObject.updatedExisting,
  };
};

export const updateOrderService = async (orderId, payload) => {
  const updatedOrder = OrderModel.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
  });

  return updatedOrder;
};

// import { SORT_ORDER } from '../constants/constants.js';

// import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// //   const [totalCount, contacts] = await Promise.all([
// //     ContactsCollection.find().merge(contactQuery).countDocuments(),

// //     contactQuery
// //       .sort({ [sortBy]: sortOrder })
// //       .skip(skipValue)
// //       .limit(limitValue),
// //   ]);

// //   const paginationData = calculatePaginationData(totalCount, page, perPage);

// //   return { data: contacts, ...paginationData };
// // };

// export const getAllOrdersService = async ({
//   page,
//   perPage,
//   sortBy,
//   sortOrder,
//   filter = {},
// }) => {
//   const limit = perPage;
//   const skip = (page - 1) * perPage;

//   const [totalCount, orders] = await Promise.all([
//     OrderModel.find().merge(orderQuery).countDocuments(),

//     orderQuery
//       .sort({ [sortBy]: sortOrder })
//       .skip(skip)
//       .limit(limit),
//   ]);

//   // const orderQuery = OrderModel.find(filter);
//   // // const countOrders = await OrderModel.find()
//   // //   .merge(orderQuery)
//   // //   .countDocuments();

//   // const countOrders = await OrderModel.countDocuments(orderQuery.getQuery());

//   const orderQuery = OrderModel.find({}); // Без filter
//   const countOrders = await OrderModel.countDocuments({});

//   const orders = await orderQuery
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder });

//   const paginationData = calculatePaginationData(countOrders, page, perPage);

//   return {
//     data: orders,
//     ...paginationData,
//   };
// };
