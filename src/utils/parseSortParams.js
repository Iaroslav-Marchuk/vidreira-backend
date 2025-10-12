const allowedKeys = [
  'EP',
  'cliente',
  'local.zona',
  'createdAt',
  'status',
  'falta',
];

export const parseSortBy = (sortBy) =>
  allowedKeys.includes(sortBy) ? sortBy : 'createdAt';

export const parseSortOrder = (sortOrder) =>
  sortOrder === 'desc' ? 'desc' : 'asc';

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;
  return {
    sortBy: parseSortBy(sortBy),
    sortOrder: parseSortOrder(sortOrder),
  };
};

const getValue = (obj, key) => key.split('.').reduce((acc, k) => acc?.[k], obj);

export const sortOrders = (orders, sortBy = 'createdAt', sortOrder = 'asc') => {
  if (!Array.isArray(orders)) return [];

  const sortedOrders = [...orders];

  if (sortBy === 'cliente') {
    return sortedOrders.sort((a, b) => {
      const nameA = a.cliente?.name?.toLowerCase() || '';
      const nameB = b.cliente?.name?.toLowerCase() || '';
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  if (sortBy === 'falta') {
    return sortedOrders.sort((a, b) => {
      const aVal = Number(a.falta || 0);
      const bVal = Number(b.falta || 0);
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  return sortedOrders.sort((a, b) => {
    const valA = getValue(a, sortBy);
    const valB = getValue(b, sortBy);

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortOrder === 'asc'
      ? (valA || 0) - (valB || 0)
      : (valB || 0) - (valA || 0);
  });
};
