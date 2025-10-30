import createHttpError from 'http-errors';
import { OrderModel } from '../models/orderModel.js';

export const getStatsService = async () => {
  const today = new Date();
  const thisDay = today.getDate();
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(today.getDate() - 1);
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const lastMonth = (thisMonth - 1 + 12) % 12;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const allOrders = await OrderModel.find().populate('client');
  if (!allOrders || allOrders.length === 0) {
    throw createHttpError(404, 'Orders not found!');
  }

  const allItems = allOrders.flatMap((order) => order.items);

  const completedOrders = allOrders.filter((o) => o.status === 'Concluído');
  const completedItems = allItems.filter((item) => item.status === 'Concluído');

  const noCompletedOrdersTotal = () => {
    return allOrders.filter((o) => o.status !== 'Concluído').length;
  };

  const noCompletedItemsTotal = () => {
    return allItems
      .filter((item) => item.status !== 'Concluído')
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  let averageItemExecutionTime = { hours: 0, days: 0 };

  if (completedItems.length > 0) {
    const totalTimeMs = completedItems.reduce((acc, item) => {
      const created = new Date(item.createdAt);
      const completed = new Date(item.updatedAt);
      return acc + (completed - created);
    }, 0);

    const avgMs = totalTimeMs / completedItems.length;
    const avgHours = avgMs / (1000 * 60 * 60);
    const avgDays = avgMs / (1000 * 60 * 60 * 24);

    averageItemExecutionTime = {
      hours: avgHours.toFixed(1),
      days: avgDays.toFixed(2),
    };
  }

  const createdOrdersToday = () =>
    allOrders.filter((o) => {
      const date = new Date(o.createdAt);
      return (
        date.getDate() === thisDay &&
        date.getMonth() === thisMonth &&
        date.getFullYear() === thisYear
      );
    });

  const createdItemsToday = () => {
    const itemsToday = createdOrdersToday().flatMap((order) => order.items);
    return itemsToday.reduce((sum, item) => sum + item.quantity, 0);
  };

  const completedOrdersToday = () =>
    completedOrders.filter((o) => {
      const date = new Date(o.updatedAt);
      return (
        date.getDate() === thisDay &&
        date.getMonth() === thisMonth &&
        date.getFullYear() === thisYear
      );
    });

  const partiallyCompletedOrdersToday = () => {
    const results = [];

    const todayOrders = allOrders.filter((order) =>
      order.items.some((item) => {
        if (item.status !== 'Concluído') return false;
        const date = new Date(item.updatedAt);
        return (
          date.getDate() === thisDay &&
          date.getMonth() === thisMonth &&
          date.getFullYear() === thisYear
        );
      }),
    );

    todayOrders.forEach((order) => {
      const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
      const completedItems = order.items
        .filter((i) => i.status === 'Concluído')
        .reduce((sum, i) => sum + i.quantity, 0);
      const pendingItems = totalItems - completedItems;

      if (pendingItems > 0) {
        results.push({
          EP: order.EP,
          client: order.client?.name || 'Sem nome',
          totalItems,
          completedItems,
          pendingItems,
        });
      }
    });

    return results;
  };

  const completedItemsToday = () => {
    const todayItems = completedItems.filter((item) => {
      const date = new Date(item.updatedAt);
      return (
        date.getDate() === thisDay &&
        date.getMonth() === thisMonth &&
        date.getFullYear() === thisYear
      );
    });

    return todayItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const createdOrdersYesterday = () =>
    allOrders.filter((order) => {
      const date = new Date(order.createdAt);
      return (
        date.getDate() === yesterdayDate.getDate() &&
        date.getMonth() === yesterdayDate.getMonth() &&
        date.getFullYear() === yesterdayDate.getFullYear()
      );
    });
  const createdItemsYesterday = () => {
    const itemsYesterday = createdOrdersYesterday().flatMap(
      (order) => order.items,
    );
    return itemsYesterday.reduce((sum, item) => sum + item.quantity, 0);
  };

  const completedOrdersYesterday = () =>
    completedOrders.filter((order) => {
      const date = new Date(order.updatedAt);
      return (
        date.getDate() === yesterdayDate.getDate() &&
        date.getMonth() === yesterdayDate.getMonth() &&
        date.getFullYear() === yesterdayDate.getFullYear()
      );
    });

  const completedItemsYesterday = () => {
    const todayItems = completedItems.filter((item) => {
      const date = new Date(item.updatedAt);
      return (
        date.getDate() === yesterdayDate.getDate() &&
        date.getMonth() === yesterdayDate.getMonth() &&
        date.getFullYear() === yesterdayDate.getFullYear()
      );
    });
    return todayItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const createdOrdersThisMonth = () =>
    allOrders.filter((o) => {
      const date = new Date(o.createdAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

  const createdItemsThisMonth = () => {
    const itemsThisMonth = createdOrdersThisMonth().flatMap(
      (order) => order.items,
    );
    return itemsThisMonth.reduce((sum, item) => sum + item.quantity, 0);
  };

  const completedOrdersThisMonth = () =>
    completedOrders.filter((order) => {
      const date = new Date(order.updatedAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });

  const completedItemsThisMonth = () => {
    const itemsThisMonth = completedItems.filter((item) => {
      const date = new Date(item.updatedAt);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    return itemsThisMonth.reduce((sum, item) => sum + item.quantity, 0);
  };

  const createdOrdersLastMonth = () =>
    allOrders.filter((order) => {
      const date = new Date(order.createdAt);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

  const createdItemsLastMonth = () => {
    const itemsLastMonth = createdOrdersLastMonth().flatMap(
      (order) => order.items,
    );
    return itemsLastMonth.reduce((sum, item) => sum + item.quantity, 0);
  };

  const completedOrdersLastMonth = () =>
    completedOrders.filter((order) => {
      const date = new Date(order.updatedAt);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });
  const completedItemsLastMonth = () => {
    const itemsLastMonth = completedItems.filter((item) => {
      const date = new Date(item.updatedAt);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });
    return itemsLastMonth.reduce((sum, item) => sum + item.quantity, 0);
  };

  const activeOrdersByZone = () =>
    allOrders
      .filter((order) => order.status !== 'Concluído')
      .reduce((acc, o) => {
        const zona = o.local.zona;
        acc[zona] = (acc[zona] || 0) + 1;
        return acc;
      }, {});

  const activeItemsByZone = () =>
    allOrders
      .filter((o) => o.status !== 'Concluído')
      .reduce((acc, o) => {
        const zona = o.local.zona;
        const totalItemsInOrder = o.items
          .filter((item) => item.status !== 'Concluído')
          .reduce((sum, item) => sum + item.quantity, 0);

        acc[zona] = (acc[zona] || 0) + totalItemsInOrder;
        return acc;
      }, {});

  const overdues = () => {
    const pendingOrders = allOrders.filter((o) => o.status !== 'Concluído');

    if (pendingOrders.length === 0) return [];

    const oldestDate = pendingOrders.reduce((oldest, order) => {
      const created = new Date(order.createdAt);
      return created < oldest ? created : oldest;
    }, new Date());

    const oldestOrders = pendingOrders.filter((order) => {
      const created = new Date(order.createdAt);
      return (
        created.getFullYear() === oldestDate.getFullYear() &&
        created.getMonth() === oldestDate.getMonth() &&
        created.getDate() === oldestDate.getDate()
      );
    });

    return oldestOrders.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  };

  const stats = {
    noCompletedOrdersTotal: noCompletedOrdersTotal(),
    noCompletedItemsTotal: noCompletedItemsTotal(),

    partiallyCompletedOrdersToday: partiallyCompletedOrdersToday(),

    createdOrdersToday: createdOrdersToday(),
    createdItemsToday: createdItemsToday(),
    completedOrdersToday: completedOrdersToday(),
    completedItemsToday: completedItemsToday(),

    createdOrdersYesterday: createdOrdersYesterday(),
    createdItemsYesterday: createdItemsYesterday(),
    completedOrdersYesterday: completedOrdersYesterday(),
    completedItemsYesterday: completedItemsYesterday(),

    createdOrdersThisMonth: createdOrdersThisMonth(),
    createdItemsThisMonth: createdItemsThisMonth(),
    completedOrdersThisMonth: completedOrdersThisMonth(),
    completedItemsThisMonth: completedItemsThisMonth(),

    createdOrdersLastMonth: createdOrdersLastMonth(),
    createdItemsLastMonth: createdItemsLastMonth(),
    completedOrdersLastMonth: completedOrdersLastMonth(),
    completedItemsLastMonth: completedItemsLastMonth(),

    activeOrdersByZone: activeOrdersByZone(),
    activeItemsByZone: activeItemsByZone(),

    averageItemExecutionTime,
    overdues: overdues(),
  };

  return stats;
};
