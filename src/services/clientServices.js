import createHttpError from 'http-errors';
import { ClientModel } from '../models/clientModel.js';

export const getAllClientsService = async () => {
  const clients = await ClientModel.find();
  if (!clients) {
    throw createHttpError(404, 'Clients not found!');
  }
  return clients;
};
