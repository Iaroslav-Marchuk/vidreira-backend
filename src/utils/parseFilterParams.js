const ZONAS = ['L1', 'L2', 'L3'];
const STATUSES = ['created', 'inProgress', 'completed'];

function parseNumber(value) {
  const isString = typeof value === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) {
    return;
  }
  return parsedNumber;
}

function parseZona(zona) {
  const isString = typeof zona === 'string';
  if (!isString) return;

  const isZona = (zona) => ZONAS.includes(zona);

  if (isZona(zona)) return zona;
}

function parseStatus(status) {
  const isString = typeof status === 'string';
  if (!isString) return;

  const isStatus = (status) => STATUSES.includes(status);

  if (isStatus(status)) return status;
}

function parseIsTemper(temper) {
  if (temper === 'true') return true;
  if (temper === 'false') return false;
  return undefined;
}

const parseDate = (dateValue) => {
  const date = new Date(dateValue);
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
  };
};
