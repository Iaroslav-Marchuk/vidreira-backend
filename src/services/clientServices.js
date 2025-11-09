import createHttpError from 'http-errors';
import { ClientModel } from '../models/clientModel.js';

export const getAllClientsService = async () => {
  const clients = await ClientModel.find()
    .sort({ name: 1 })
    .collation({ locale: 'pt' })
    .exec();

  if (!clients || clients.length === 0) {
    throw createHttpError(404, 'Clients not found!');
  }

  return clients;
};
