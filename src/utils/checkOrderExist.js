import { ClientModel } from '../models/clientModel.js';
import { OrderModel } from '../models/orderModel.js';

export const checkOrderExists = async (EP, client) => {
  let clientId = client;

  if (typeof client === 'string') {
    const foundClient = await ClientModel.findOne({ name: client });
    if (!foundClient) return { exists: false, reason: 'Client not found' };
    clientId = foundClient._id;
  }

  const order = await OrderModel.findOne({
    EP,
    client: clientId,
    status: { $ne: 'FINISHED' },
  }).populate('client');

  if (!order) return { exists: false, clientId };
  return { exists: true, order, clientId };
};
