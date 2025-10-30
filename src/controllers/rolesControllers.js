import { getAllRolesService } from '../services/roleServices.js';

export const getAllRolesController = (req, res) => {
  const roles = getAllRolesService();

  res.status(200).json({
    status: 200,
    message: 'Succsessfully found roles!',
    roles,
  });
};
