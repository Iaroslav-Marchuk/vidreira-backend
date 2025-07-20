function parseNumber(value) {
  const isString = typeof value === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) {
    return;
  }
}

function parseZona(value) {
  const isString = typeof value === 'string';
  if (!isString) return;

  const isZona = (value) => {
    ['L1', 'L2', 'L3'].includes(value);
  };

  if (isZona(value)) return value;
}

function parseStatus(value) {
  const isString = typeof value === 'string';
  if (!isString) return;

  const isStatus = (value) => {
    ['created', 'inProgress', 'completed'].includes(value);
  };

  if (isStatus(value)) return value;
}

function parseIsTemper(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

const parseDate = (value) => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

export const parseFilterParams = (query) => {
  const {
    EP,
    cliente,
    zona,
    operator,
    status,
    category,
    type,
    temper,
    sizeZ,
    createdAt,
    updatedAt,
  } = query;

  const parsedEP = parseNumber(EP);
  const parsedCliente = parseNumber(cliente);
  const parsedZona = parseZona(zona);
  const parsedOperator = parseNumber(operator);
  const parsedStatus = parseStatus(status);
  const parsedCategory = parseNumber(category);
  const parsedType = parseNumber(type);
  const parsedTemper = parseIsTemper(temper);
  const parsedSizeZ = parseNumber(sizeZ);
  const parsedCreatedAt = parseDate(createdAt);
  const parsedUpdatedAt = parseDate(updatedAt);

  return {
    EP: parsedEP,
    cliente: parsedCliente,
    zona: parsedZona,
    operator: parsedOperator,
    status: parsedStatus,
    category: parsedCategory,
    type: parsedType,
    temper: parsedTemper,
    sizeZ: parsedSizeZ,
    createdAt: parsedCreatedAt,
    updatedAt: parsedUpdatedAt,
  };
};
