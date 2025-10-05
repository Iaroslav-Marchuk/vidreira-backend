import { getAllClientsService } from '../services/clientServices.js';

export const getAllClientsController = async (req, res) => {
  const clients = await getAllClientsService();

  res.status(200).json({
    status: 200,
    message: 'Successfully found clients!',
    clients,
  });
};
