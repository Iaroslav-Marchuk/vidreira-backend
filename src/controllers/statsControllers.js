import { getStatsService } from '../services/statsServices.js';

export const getStatsController = async (req, res) => {
  const stats = await getStatsService();

  res.status(200).json({
    status: 200,
    message: 'Succsessfully found stats!',
    stats,
  });
};
