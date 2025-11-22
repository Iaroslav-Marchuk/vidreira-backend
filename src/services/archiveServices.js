import { SORT_ORDER } from '../constants/constants.js';
import { OrderModel } from '../models/orderModel.js';
import { sortOrders } from '../utils/parseSortParams.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getArchiveService = async ({
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
    { $match: { ...cleanFilter, status: 'FINISHED' } },
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
