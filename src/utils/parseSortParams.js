const keys = ['EP', 'cliente', 'local.zona', 'createdAt', 'status'];

function parseSortBy(sortBy) {
  if (typeof sortBy === 'undefined') {
    return 'createdAt';
  }

  return keys.includes(sortBy) ? sortBy : 'createdAt';
}

function parseSortOrder(sortOrder) {
  if (typeof sortOrder === 'undefined') {
    return 'asc';
  }

  return sortOrder === 'desc' ? 'desc' : 'asc';
}

export const parseSortParams = (query) => {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

export const sortOrders = (orders, sortBy, sortOrder = 'asc') => {
  return [...orders].sort((a, b) => {
    // Допоміжна функція для вкладених полів
    const getValue = (obj, key) =>
      key.split('.').reduce((acc, k) => acc?.[k], obj);

    // Сортування по клієнту
    if (sortBy === 'cliente') {
      const nameA = a.cliente?.name?.toLowerCase() || '';
      const nameB = b.cliente?.name?.toLowerCase() || '';
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    // Сортування по обчислюваному полі "falta"
    if (sortBy === 'falta') {
      return sortOrder === 'asc' ? a.falta - b.falta : b.falta - a.falta;
    }

    // Інші поля
    const valA = getValue(a, sortBy);
    const valB = getValue(b, sortBy);

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });
};
