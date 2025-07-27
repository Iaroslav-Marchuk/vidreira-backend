const keys = ['_id', 'EP', 'zona', 'createdAt', 'status'];

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
