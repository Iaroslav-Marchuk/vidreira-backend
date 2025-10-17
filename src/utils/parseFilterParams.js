function parseNumber(value) {
  const isString = typeof value === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) {
    return;
  }
  return parsedNumber;
}

function parseClient(client) {
  if (!client) return undefined;
  return client.trim();
}

const parseDate = (dateValue) => {
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? undefined : date;
};

export const parseFilterParams = (query) => {
  const { EP, client, operator, category, type, sizeZ, createdAt } = query;

  const parsedEP = parseNumber(EP);
  const parsedClient = parseClient(client);
  const parsedOperator = parseNumber(operator);
  const parsedCategory = parseNumber(category);
  const parsedType = parseNumber(type);
  const parsedSizeZ = parseNumber(sizeZ);
  const parsedCreatedAt = parseDate(createdAt);

  return {
    EP: parsedEP,
    client: parsedClient,
    operator: parsedOperator,
    category: parsedCategory,
    type: parsedType,
    sizeZ: parsedSizeZ,
    createdAt: parsedCreatedAt,
  };
};
