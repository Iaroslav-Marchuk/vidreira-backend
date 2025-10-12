function parseNumber(value) {
  const isString = typeof value === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) {
    return;
  }
  return parsedNumber;
}

function parseCliente(cliente) {
  if (!cliente) return undefined;
  return cliente.trim(); // залишаємо рядком, бо це ім'я
}

const parseDate = (dateValue) => {
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? undefined : date;
};

export const parseFilterParams = (query) => {
  const { EP, cliente, operator, category, type, sizeZ, createdAt } = query;

  const parsedEP = parseNumber(EP);
  const parsedCliente = parseCliente(cliente);
  const parsedOperator = parseNumber(operator);
  const parsedCategory = parseNumber(category);
  const parsedType = parseNumber(type);
  const parsedSizeZ = parseNumber(sizeZ);
  const parsedCreatedAt = parseDate(createdAt);

  return {
    EP: parsedEP,
    cliente: parsedCliente,
    operator: parsedOperator,
    category: parsedCategory,
    type: parsedType,
    sizeZ: parsedSizeZ,
    createdAt: parsedCreatedAt,
  };
};
