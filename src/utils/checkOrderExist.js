import { ClientModel } from '../models/clientModel.js';
import { OrderModel } from '../models/orderModel.js';

export const checkOrderExists = async (EP, cliente) => {
  let clientId = cliente;

  if (typeof cliente === 'string') {
    const client = await ClientModel.findOne({ name: cliente });
    if (!client) return { exists: false, reason: 'client_not_found' };
    clientId = client._id;
  }

  const order = await OrderModel.findOne({
    EP,
    cliente: clientId,
  }).populate('cliente');

  if (!order) return { exists: false };
  return { exists: true, order };
};
