function parseSortBy(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }
  const keys = ['_id', 'EP', 'zona', 'createdAt', 'updatedAt', 'status'];

  if (keys.includes(value !== true)) {
    return 'createdAt';
  }
  return value;
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') {
    return 'asc';
  }

  return value === 'desc' ? 'desc' : 'asc';
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
