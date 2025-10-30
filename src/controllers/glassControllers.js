import { getGlassOptionsService } from '../services/glassServices.js';

export const getGlassOptionsController = (req, res) => {
  const glassOptions = getGlassOptionsService();

  res.status(200).json({
    status: 200,
    message: 'Succsessfully found glass options!',
    glassOptions,
  });
};
